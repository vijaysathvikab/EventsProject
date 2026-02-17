const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cookie = require('cookie-parser');

dotenv.config({path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

const cssjslinks = path.join(__dirname,'./');
app.use(express.static(cssjslinks));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookie());


 app.set('view engine', 'hbs'); 

/* app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
 */
db.connect( (error) => {
    if (error) {
        console.log(error);
    }else{
        console.log('MYSQL connected...');
    }
});



app.use('/', require('./pages'));
app.use('/auth', require('./auth'));


app.listen(5001,()=>{
    console.log('Server started on port 5001');
});