const router = require('express').Router();
const passport = require('passport');
const controller = require('./controller');

router.get('/:id', controller.getUser);
router.post('/', passport.authenticate('jwt', { session: false }), controller.createUser);
router.post('/login', controller.loginUser);

module.exports = router;