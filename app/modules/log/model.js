const mongoose = require('mongoose');

const LogSchema = mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            require: true,
        },
        type: {
            type: String,
            require: true,
            enum : ['in', 'out']
        },
    }, {
        timestamps: {
            createdAt: true,
            updatedAt: false
        }
    }
);

module.exports = mongoose.model('Log', LogSchema);