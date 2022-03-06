const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

const Controller = require('./controllers/Controller');

router.use('/', Controller.index);

// app.get('/', (req, res) => {
//     res.render('home');
// })

module.exports = router;