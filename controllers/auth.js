const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const express = require('express');
/* const upload = require('express-fileupload'); */
const multer = require('multer');
/* var bodyParser = require('body-parser') */
/* const busboy = require('connect-busboy'); */
var email=null;
var username=null;


const storage = multer.diskStorage({ 
    destination: './public/uploads',
    filename: function(req, file ,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('file');
const app = express();

/* app.use(upload()); */

const cssjslinks = path.join(__dirname,'../');
app.use(express.static(cssjslinks));


 const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

exports.login = async (req,res) => {
    try{
        email= req.body.email;
        const password= req.body.password;
        

        if(!email || !password){
            return res.render('loginform', {
                message: 'Please enter both fields'
            });
        }

        

        db.query('SELECT * FROM customer WHERE C_email = ?',[email], async (error,result) => {
            console.log(result);
            if(!result[0] || !(await bcrypt.compare(password, result[0].C_password))){
                res.render('loginform', {
                    message: 'email or password is incorrect'
                });                
            }else{

                username=result[0].C_username;
                const id = result[0].C_username;
                const token = jwt.sign({ id},process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("the token: "+ token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly: true
                }
                
                res.cookie('jwt', token, cookieOptions );
                
                res.status(200).render('profile_home',{
                message: username,
                userloggedin: 'userloggedin'
                });
            }
        });
    }catch(err){
        console.log(err)
    }
}

exports.register = (req,res) => {
    console.log(req.body);

    



    /* const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const dob = req.body.DOB; */
    
    const email1 = req.body.email;
    const uname1 = req.body.username;
    const { firstname, lastname, mail, dob, uname, password } = req.body;
    
    db.query('SELECT C_email FROM customer WHERE C_email = ?', [email1], async (error,result) => {
        if (error){
            console.log(error);
        }else{
            if (result.length>0){
                return res.render('register', {
                    message: 'Email alreay in use'
                });
            }
        }

        db.query('SELECT C_username FROM customer WHERE C_username = ?', [uname1], async (error,result) => {
            if (error){
                console.log(error);
            }else{
                
                if (result.length>0){
                    return res.render('register', {
                        message: 'username already in use'
                    });
                }
            }
        

        let hashedpassword = await bcrypt.hash(password, 8);
        console.log(hashedpassword);

        db.query('INSERT INTO customer SET ?',{C_firstname:firstname, C_lastname:lastname, C_email:email1 ,C_password: hashedpassword, C_dob: req.body.DOB, C_username: uname1,C_budget_total: 0,C_expense_total: 0}, (error,result) => {
            if(error){
                console.log(error);
            }else{
                return res.render('loginform', {
                    message: 'User registered'
                });
            }
        });
    });
    });
}

exports.profile = async (req,res) => {
    const newbudget = req.body.budget_total_change;

    db.query('UPDATE customer SET C_budget_total=? WHERE C_email=?',[newbudget, email], async (error,result) => {
        if (error){
            console.log(error);
        }else{
            return res.render('profile_home',{
                successmessage: 'Total budget changed',
                message: username
            });
        }
    });
}




exports.addevent = (req,res) => {
    const E_name = req.body.E_name;
    const E_address = req.body.E_address;
    const E_type = req.body.E_type;
    const E_budget=req.body.E_budget;
    var E_start_date=req.body.E_startdate;
    var E_start_date_time=Date.parse(E_start_date);
    var E_end_date=req.body.E_enddate;
    const currentDate = new Date();
    const E_timeadded = currentDate.getTime();
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today =yyyy + '-' + mm  + '-' + dd;
    today = Date.parse(today);
    /* let datediff= req.body.E_startdate.getTime() - today.getTime();*/
    var E_alert_status=null;
    let msInDay = 1000 * 3600 * 24;
    var timeleft = today-E_start_date_time;
    let daysleft = (today-E_start_date_time)/msInDay;

    if(daysleft>15){
        E_alert_status = "low";
    }else if(daysleft > 5){
        E_alert_status = "mid";
    }else if(daysleft>0){
        E_alert_status = "high";
    }else{
        E_alert_status = "started";
    }

    var E_expense = 0;

    db.query('INSERT INTO events SET ?',{C_username: username,E_timeadded: E_timeadded,E_name: E_name,E_address: E_address, E_type: E_type,E_startdate: E_start_date,E_enddate: E_end_date,E_timeleft: timeleft,E_alert_status: E_alert_status,E_expense: E_expense,E_budget: E_budget}, async (err, result) => {
        if (err){
            console.log(err)
        }else{
            res.render('profile_home',{
                insertsuccessmessage:'inserted successfully',
                message: username
            });
        }
    });


    console.log(E_name, E_address, E_type, E_start_date, E_end_date,E_timeadded,today,daysleft,typeof(today),username,E_alert_status,E_budget);
}



exports.addbudget = (req,res) => {
    const budgetaddition= parseInt(req.body.budget_total_add);
    var prevbudget=0;

    db.query('SELECT C_budget_total FROM customer WHERE C_email = ?',[email], async (error,result) => {
        if (error){
            console.log(error);
        }else{
            prevbudget=parseInt(result[0].C_budget_total);
            console.log(result);
        }
    const newbudget=parseInt(budgetaddition+prevbudget);
        db.query('UPDATE customer SET C_budget_total=? WHERE C_email=?',[newbudget, email],async (error,result) => {
            if(error){
                console.log(error);
            }else{

                res.render('profile_home',{
                    addsuccessmessage: 'add successful',
                    message: username
                });
                
            }
        });


    });
}




exports.getonlogin= (req,res) => {
    
    console.log(username);
    var totalbudget=0;
    var totalexpense=0;
    var eventaddtimeagain=0;
    var expense_status='no data';
    var eventexpense=0;
    db.query('SELECT E_timeadded FROM events WHERE C_username=? ORDER BY E_startdate',[username], async (error,result1)=>{
        if (error){
            console.log(error);
        }else{
            console.log(result1);
           
            for (var i=0; i<result1.length;i++){
                eventexpense=0;
                var eventaddtime=result1[i].E_timeadded;
                console.log(eventaddtime);
                db.query('SELECT Expense_amount,E_timeadded FROM event_expenses WHERE E_timeadded=?',[eventaddtime], async (error,result2)=>{
                    if (error){
                        console.log(error);
                    }else{
                        if(Object.keys(result2).length != 0){ 
                            console.log(result2); 
                        eventexpense=0;
                        
                        for (var j=0; j<result2.length;j++){
                            eventaddtimeagain=result2[j].E_timeadded;
                            eventexpense = eventexpense + result2[j].Expense_amount;
                            
                            
                            
                        }
                        totalexpense=totalexpense+eventexpense;
                        console.log(totalexpense);
                        }  

                        /* db.query('UPDATE events SET E_expense = ? WHERE C_username=? AND E_timeadded=?',[eventexpense,username,eventaddtimeagain], async (error,result) => {
                            if(error){
                                console.log(error);
                            }else{
                                console.log(eventaddtimeagain);
                                console.log(eventexpense);
                                }
                            }); */


                            db.query('UPDATE customer SET C_expense_total=? WHERE C_username=?',[totalexpense, username], async (error,result)=>{
                                if(error){
                                     console.log(error);
                                }
                            });    

                        

                    }
                    
                    
                });

                
                

                    
                      
                    

                

            }

            

        }
    });

    db.query("SELECT C_budget_total,C_expense_total,profilepic FROM customer WHERE C_username=?",[username], async (error,result) => {
        if (error){
            console.log(error);
        }else{
            
            totalbudget=0;
            totalexpense=0;
            var today = new Date();
            console.log(result);
            if(Object.keys(result).length != 0){ 
            if(result[0].profilepic != null){
                var profilepic = result[0].profilepic.replace(/\\/g, '/');
                    
            }else{
                var profilepic = '../profileimg.jpg';
                }    
            totalbudget = parseInt(result[0].C_budget_total);
            totalexpense = parseInt(result[0].C_expense_total);
            
            if((totalexpense/totalbudget)*100 <= 50){
                expense_status='low';
                totalexpense=0;
            }else if((totalexpense/totalbudget)*100 > 50 && (totalexpense/totalbudget)*100 <= 85){
                expense_status='balanced';
                totalexpense=0;
            }else if((totalexpense/totalbudget)*100 > 85 && (totalexpense/totalbudget)*100 <= 100){
                expense_status='critical';
                totalexpense=0;
            }else{
                expense_status='exceeded';
                totalexpense=0;
            }
        }
            
            






            db.query("SELECT E_startdate,E_enddate,C_username,E_timeadded,E_name,E_address,E_type,E_expense,E_budget FROM events WHERE C_username=? ORDER BY E_startdate",[username], async (error,result)=>{
                if(error){
                    console.log(error);
                }else{
                    
                    if(Object.keys(result).length != 0){ 
                    var closestdate=result[0].E_startdate;
                    }else{
                        var closestdate=0;
                    }
                    var E_start_date_time=Date.parse(closestdate);
                    var today = new Date();
                    let msInDay = 1000 * 3600 * 24;
                    
                    for(var i=0; i<result.length;i++){
                        closestdate=result[i].E_startdate;
                        E_start_date_time=Date.parse(closestdate);
                        if(E_start_date_time - today > 0){
                            break;
                        }
                    }
                    var timeleft = E_start_date_time-today;
                    var daysleft = Math.ceil((timeleft)/msInDay);
                    if(timeleft>0){
                        daysleft = Math.ceil((timeleft)/msInDay);
                    }else{
                        daysleft = "no upcoming event";
                    }
                   /*  for(var i=0; i<result.length;i++){
                        totalexpense=totalexpense+result[i].E_expense;
                    }

                    db.query('UPDATE customer SET C_expense_total=? WHERE C_username=?',[totalexpense, username], async (error,result)=> {
                        if(error){
                            console.log(error);
                        }else{
                            console.log(totalexpense);
                        }
                    }); */
                    totalexpense = totalexpense.toFixed(2);
                    /* console.log(result); */
                    res.render('profile_home',{
                        message: username,
                        totalbudget: totalbudget,
                        totalexpense: totalexpense,
                        expense_status: expense_status,
                        daysleft: daysleft,
                        eventresult: result,
                        profilepic: profilepic
                        
                    });
                
                }
            });


            
        }
    })
}



exports.addeventexpense= (req,res) => {
    var addexpenseclicktimeadded = req.body.clickedeventtimeadded;
    var expensename = req.body.event_expense_name;
    var expenseamount = req.body.event_expense_amount;
    var totalexpense=0;
    db.query('INSERT INTO event_expenses values(?,?,?,?)',[username,addexpenseclicktimeadded,expensename,expenseamount], async (error,result)=> {
        if (error){
            console.log(error);
        }else{
            db.query('SELECT E_timeadded FROM events WHERE C_username=? ORDER BY E_startdate',[username], async (error,result1)=>{
                if (error){
                    console.log(error);
                }else{
                    console.log(result1);
                   
                    for (var i=0; i<result1.length;i++){
                        eventexpense=0;
                        var eventaddtime=result1[i].E_timeadded;
                        console.log(eventaddtime);
                        db.query('SELECT Expense_amount,E_timeadded FROM event_expenses WHERE E_timeadded=?',[eventaddtime], async (error,result2)=>{
                            if (error){
                                console.log(error);
                            }else{
                                if(Object.keys(result2).length != 0){ 
                                    console.log(result2); 
                                eventexpense=0;
                                
                                for (var j=0; j<result2.length;j++){
                                    eventaddtimeagain=result2[j].E_timeadded;
                                    eventexpense = eventexpense + result2[j].Expense_amount;
                                    
                                    
                                    
                                }
                                totalexpense=totalexpense+eventexpense;
                                console.log(totalexpense);
                                  
        
                                db.query('UPDATE events SET E_expense = ? WHERE C_username=? AND E_timeadded=?',[eventexpense,username,eventaddtimeagain], async (error,result) => {
                                    if(error){
                                        console.log(error);
                                    }else{
                                        console.log(eventaddtimeagain);
                                        console.log(eventexpense);
                                        }
                                    });
        
                                
        
                            }
                            db.query('UPDATE customer SET C_expense_total=? WHERE C_username=?',[totalexpense, username], async (error,result)=>{
                                if(error){
                                     console.log(error);
                                }
                            });
                        }
                            
                        });
        
                        
                        
        
                            
                              
                        }
        
                        
        
                    
        
                    
        
                }
            });
            res.render('profile_home',{
                message: username,
                eventexpensesuccess: 'expense successfully added'
                
            });
        }
    });
} 




exports.deleted = (req,res) => {
    var timetodelete = req.body.clickedeventtimedelete;
    console.log(timetodelete);

    db.query('DELETE FROM events WHERE C_username=? AND E_timeadded=?',[username,timetodelete], async (error,result) => {
        if (error){
            console.log(error);
        }else{
            res.render('profile_home',{
                message: username,
                deletesuccess: 'successful deletion'
            });
        }
    })
    
}


exports.imageupload = (req,res)=>{
    upload(req,res, (err) => {
        if(err){
            console.log(err);
        }else{
            var pathname =  req.file.path;
            
            db.query('UPDATE customer SET profilepic=? WHERE C_username=?',[pathname,username], async (error,result)=>{
                if(error){
                    console.log(error);
                }else{
                    res.render('profile_home',{
                        message: username,
                        imageuploaded: true
                    });
                }
            });
            
        }
    });
    
    
}



exports.eventdesc = (req,res)=>{
    if(username!=null){
    db.query('SELECT E_timeadded,S.S_name,S.S_topic,S.S_Prof FROM speakers S WHERE S.C_username=?',[username],async(error,result)=>{
        if(error){
            console.log(error);
        }else{
            db.query('SELECT E_timeadded,G.g_name,G.g_phno,G.g_gender FROM guests G WHERE G.C_username=?',[username],async (error,result1)=>{
                if(error){console.log(error);}
                else{
                    console.log(result);
                res.render('eventdesc',{
                    message:username,
                    result:result,
                    result1:result1
                    });
                }
            });
            
        }
    });
    }
}

exports.addspeaker = (req,res)=>{
    var spkname=req.body.speaker_name;
    var spktopic=req.body.speaker_topic;
    var spkprof=req.body.speaker_profession;
    var timeadded=req.body.timeadded;
    db.query('INSERT INTO speakers(C_username,E_timeadded,s_name,s_topic,s_prof) values(?,?,?,?,?);',[username,timeadded,spkname,spktopic,spkprof],async (error,result)=>{
        if(error){
            console.log(error);
        }else{
            res.render('eventdesc',{
                message:username
            });
        }
    });
    
}

exports.addguest = (req,res)=>{
    var gstname=req.body.guest_name;
    var gstphno=req.body.guest_phno;
    var gstgender=req.body.guest_gender;
    var timeadded=req.body.timeadded;
    db.query('INSERT INTO guests(C_username,E_timeadded,g_name,g_phno,g_gender) values(?,?,?,?,?);',[username,timeadded,gstname,gstphno,gstgender],async (error,result)=>{
        if(error){
            console.log(error);
        }else{     
        res.render('eventdesc',{
        message:username
    });
    }
    });
}
