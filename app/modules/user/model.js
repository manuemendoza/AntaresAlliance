const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


const UserSchema = mongoose.Schema(
    {
        name:{
            type: String,
            require: true,
            trim: true 
        },
        surname: {
            type: String,
            require: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            trim: true,
            default: 'user'
        },
    }, {
        timestamps: true
    }
);

UserSchema.pre(
    'save',
    async function(next) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
);

UserSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);