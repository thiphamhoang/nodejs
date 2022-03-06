const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

const authController = require('./controllers/AuthController');

// dang ky 
// router.get('/regis', authController.getRegis);
// router.post('/regis', authController.postRegis);

// danh nhap khach hang 
router.get('/:slug', authController.getLogin);
router.post('/:slug', authController.postLogin);
// nhap nhap admin
router.get(process.env.URL_LOGIN, authController.getLogin);
router.post(process.env.URL_LOGIN, authController.postLogin);
//dang xuat
router.delete('/logout', authController.Logout);

// router.use('/', siteController.index);

// app.get('/', (req, res) => {
//     res.render('home');
// })

module.exports = router;