const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../modules/user/model');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email });
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }
                const validate = await user.isValidPassword(password);
                if (!validate) {
                    return done(null, false, { message: 'Contraseña o Usuario incorrecta' });
                }
                return done(null, user, { message: 'Logged' });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    'jwt',
    new JwtStrategy(
        {
            secretOrKey: process.env.PRIVATE_KEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                return done(null, token);
            } catch (error) {
                done(error);
            }
        }
    )
);