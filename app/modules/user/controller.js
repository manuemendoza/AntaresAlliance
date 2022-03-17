const User = require('./model');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    
    // @TODO: use role
    if (req.user.role == 'admin') {
        const user = new User(req.body);
        try {
            await user.save();
            const userData = {
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
                _id: user._id
            };
            res.status(200).json(userData);
        } catch (error) {
            Fnsole.error(error);
            if (error._message == 'User validation failed' || error.code == 11000) {
                res.status(400).json({message: error.message, code: error.code})
            } else {
                res.status(500).json({message: error.message});
            }
        }
    } else {
        res.status(404).json({message: 'access denied, you need to be an administrator '});
    }    
};

const loginUser = async (req, res, next) => {
    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
                if (err || !user) {
                    const error = new Error('An error occurred.');
                    return next(error);
                }
                req.login(
                    user,
                    { session: false },
                    async (error) => {
                        if (error) return next(error);

                        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.PRIVATE_KEY);

                        return res.json({ token });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
    )(req, res, next);
};


const getUsers = async(req, res) => {
    try {
        if (req.query.name) {
            const users = await User.find({ name: { $regex: new RegExp(req.query.name, 'i') } });
            res.status(200).json({user:users});
        } else {
            res.status(200).json( await User.find());
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message});
    }
};

const getUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select({
            'name': 1,
            'surname': 1,
            'email': 1,
            'role': 1
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: 'user not found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    createUser,
    loginUser,
    getUser,
};