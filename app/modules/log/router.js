const router = require('express').Router();
const passport = require('passport');
const controller = require('./controller');

router.get('/', passport.authenticate('jwt', { session: false }), controller.getLogs);
router.post('/', passport.authenticate('jwt', { session: false }), controller.createLog);

module.exports = router;