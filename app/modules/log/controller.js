const Log = require('./model');

const createLog = async (req, res) =>{
    const lastUserLog = await Log.findOne({userId: req.user._id});
    if (req.body.type == (lastUserLog == null ? 'out' : lastUserLog.type)) {
        res.status(400).json({message: 'Incorrect type'});    
    } else {
        const data = {
            userId: req.user._id,
            type: req.body.type
        }
        const log = new Log(data);
        try {
            await log.save();
            res.status(200).json(log);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: error.message});
        }
    }
};

const getLogs = async (req, res) =>{
    
    const filters = {};
    
    if (req.user.role == 'user'){
        filters.userId = req.user._id;
    }
    
    if (req.query.userId && req.user.role == 'admin') {
        filters.userId = req.query.userId;
    }


    try {
        const logs = await Log.find(filters);
        if (logs) {
            res.status(200).json(logs);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};


module.exports = {
    createLog,
    getLogs
}