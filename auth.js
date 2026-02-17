const express = require('express');
const authController = require('./controllers/auth');
const path = require('path');



const app = express();
const cssjslinks = path.join(__dirname,'./');
app.use(express.static(cssjslinks));



const router = express.Router();

router.post('/register', authController.register );
router.post('/login', authController.login);
router.post('/profile', authController.profile);
router.post('/addevent', authController.addevent);
router.post('/addbudget', authController.addbudget);
router.post('/addeventexpense', authController.addeventexpense);
router.post('/deleted', authController.deleted);
router.post('/imageupload',authController.imageupload);
router.post('/addspeaker',authController.addspeaker);
router.post('/addguest',authController.addguest);
module.exports = router;