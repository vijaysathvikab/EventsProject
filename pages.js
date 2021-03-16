const express = require('express');
const authController = require('./controllers/auth');
const path = require('path');



const app = express();
const cssjslinks = path.join(__dirname,'./');
app.use(express.static(cssjslinks));


const router = express.Router();

router.get('/', (req, res) => {
    res.render('home.hbs');
});

router.get('/register', (req, res) => {
    res.render('register.hbs');
});

router.get('/login', (req, res) => {
    res.render('loginform.hbs');
});

router.get('/profile', authController.getonlogin);

router.get('/eventdesc',authController.eventdesc);

module.exports = router;