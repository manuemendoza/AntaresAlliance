const User = require('./model');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
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
            console.error(error);
            if (error._message == 'User validation failed' || error.code == 11000) {
                res.status(400).json({message: error.message, code: error.code})
            } else {
                res.status(500).json({message: error.message});
            }
        }
    } else {
        res.status(403).json({message: 'access denied, you need to be an administrator '});
    }    
};

const loginUser = async (req, res) => {
    passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
                if (err || !user) {
                    res.status(400).json({message:'Invalid user or password'});
                } else {
                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);
                            const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.PRIVATE_KEY);
                            const userData = {
                                _id: user._id, 
                                name: user.name,
                                surname:user.surname,
                                email: user.email, 
                                role: user.role
                            }
                            return res.json({ token, userData });
                        }
                    );
                }
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        }
    )(req, res);
};


const getUsers = async(req, res) => {

    const filters = {};
    
    if (req.user.role == 'user'){
        filters._id = req.user._id;
    } else if (req.query._id) {
        filters._id = req.query._id;
    }

    if (req.query.name) {
        filters.name = { $regex: new RegExp(req.query.name, 'i') };
    }

    try {
        const users = await User.find(filters).select({
            _id: 1,
            name: 1,
            surname: 1,
            email: 1,
            role: 1
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message});
    }
};

const getUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select({
            _id: 1,
            name: 1,
            surname: 1,
            email: 1,
            role: 1
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
    getUsers,
};