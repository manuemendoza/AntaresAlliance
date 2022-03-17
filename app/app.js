require('dotenv').config();
const express = require('express');
const passport = require('passport');

const connectDataBase = require('./services/mongoose');
connectDataBase();

require('./services/passport/local-auth');

const userRouter = require('./modules/user/router');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(passport.initialize());
app.use(express.json());
app.use(function(err, req, res, next) {
    console.log('error', err);
    res.status(err.status || 500);
    res.json({ error: err });
});

app.use('/users', userRouter);

// a little easter egg :P
app.get('/coffee', (req, res) => res.send('So sorry', 418));

app.listen(process.env.PORT, () => console.log('El servido esta levantado en ', process.env.PORT));