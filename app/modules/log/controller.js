const Log = require('./model');
const { getJournal } = require('../../services/journal');

const createLog = async (req, res) =>{
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const lastUserLogFromToday = await Log.findOne(
        {
            userId: req.user._id,
            createdAt: { $gt: today}
        },
        null,
        { sort: { createdAt: -1 }}
    );

    if (req.body.type == (lastUserLogFromToday == null ? 'out' : lastUserLogFromToday.type)) {
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

const getLogs = async (req, res) => {
    const filters = {};
    
    if (req.user.role == 'user' && req.params.userId != req.user._id) {
        res.status(403).json({message: 'access denied, you need to be an administrator '});
    } else {
        filters.userId = req.params.userId;

        try {
            const logs = await Log.find(
                filters,
                null,
                { sort: { createdAt: 1 }}
            );
            if (logs) {
                let journal = getJournal(logs);
                res.status(200).json(journal);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: error.message});
        }
    }
};


module.exports = {
    createLog,
    getLogs
};