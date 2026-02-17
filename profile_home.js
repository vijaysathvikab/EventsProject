

/* if(localStorage.getItem("EMAIL")!=null){
    const email=localStorage.getItem("EMAIL");
    console.log(email);
    localStorage.clear();

    document.getElementById("name-user").innerHTML="welcome "+ email;
} */

if (window.location.href.indexOf("auth/login") > -1) {window.location.replace("/profile");}
window.onload = function() {
    if(localStorage.getItem("userloggedin") != null){


    if (!(window.location.href.indexOf("auth") > -1)){
    if(!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
        }
    }
    }else{
        window.location.replace('/login');
    }
}

/* Focus input */
$('input').each(function(){
    $(this).on('blur', function(){
        if($(this).val().trim() !=""){
            $(this).addClass('has-val');
        }
        else
        {
            $(this).removeClass('has-val');
        }
    })
});

/* button functions add total budget*/

document.getElementById("addtotalbudgetbutton").addEventListener('click', function(){
    document.querySelector('.bg-modal-addtotalbudget').style.display = 'flex';
    window.scrollTo(0,0);
    document.body.style.overflow= "hidden";
});

document.querySelector('.close').addEventListener('click', function(){
    document.querySelector('.bg-modal-addtotalbudget').style.display = 'none';
    document.body.style.overflow= "auto";
});

document.getElementById("changetotalbudgetbutton").addEventListener('click', function(){

    document.querySelector('.bg-modal-changetotalbudget').style.display = 'flex';
    window.scrollTo(0,0);
    document.body.style.overflow= "hidden";
});

document.querySelector('.changeclose').addEventListener('click', function(){
    document.querySelector('.bg-modal-changetotalbudget').style.display = 'none';
    document.body.style.overflow= "auto";
});

document.getElementById("addcardbutton").addEventListener('click', function(){
    document.querySelector('.bg-modal-addevent').style.display = 'flex';
    window.scrollTo(0,0);
    document.body.style.overflow= "hidden";
});

document.querySelector('.addeventpopupclose').addEventListener('click', function(){
    document.querySelector('.bg-modal-addevent').style.display = 'none';
    document.body.style.overflow= "auto";
});



document.querySelector('.eventexpensepopupclose').addEventListener('click', function(){
    document.querySelector('.bg-modal-addeventexpense').style.display = 'none';
    document.body.style.overflow= "auto";
});


document.querySelector('.deleteeventpopupclose').addEventListener('click', function(){
    document.querySelector('.bg-modal-deleteevent').style.display = 'none';
    document.body.style.overflow= "auto";
});




 function validate(){
    const name = document.getElementById("addeventname").value;
    const address = document.getElementById("addeventaddress").value;
    const type = document.getElementById("addeventtype").value;
    const budget = document.getElementById("addeventbudget").value;
    const startdate = document.getElementById("addeventstartdate").value;
    const enddate = document.getElementById("addeventenddate").value;


    if(name.length=="" || address.length =="" || type.length =="" || budget.length =="" || startdate.length =="" || enddate.length ==""){
        return false;
    }else{
        true;
    }
    console.log(name, address, type, budget, startdate, enddate);
} 

function validatechange(){
    const changetotalbudget = document.getElementById("changeinput").value;
    var regex = /^[-+]?[0-9]+\.{0,1}[0-9]+$/;
    if(!regex.test(changetotalbudget)){
        return false;
    }else{
        return true;
    }
    console.log(changetotalbudget);
}

function validateaddbudget(){
    const addtotalbudget = document.getElementById("addtobudgetinput").value;
    var regex = /^[-+]?[0-9]+\.{0,1}[0-9]+$/;
    if(!regex.test(addtotalbudget)){
        return false;
    }else{
        return true;
    }
    
}


function validateeventexpense(){
    const valideventexpenseamount = document.getElementById("addeventexpenseamountinput").value;
    var regex = /^[-+]?[0-9]+\.{0,1}[0-9]+$/;
    if(!regex.test(valideventexpenseamount)){
        return false;
    }else{
        return true;
    }
}

var img = document.querySelector("#profileimg");
var file = document.querySelector("#imagefile");



function mouseover(){
    document.getElementById("choosefiletext").style.display = "block";
}
function mouseout(){
img.addEventListener('mouseleave', function(){
    document.getElementById("choosefiletext").style.display = "none";
});
}




file.addEventListener('change', function(){
    const choosedfile = this.files[0];
    if (choosedfile){
        const reader = new FileReader();

        reader.addEventListener('load', function(){
            img.setAttribute('src',reader.result);
        });

        reader.readAsDataURL(choosedfile);
    }
});

function validateAndUpload(input){
    /* var file = input.files[0];

    if (file) {
        var image = new Image();

        image.onload = function() {
            if (this.width) { */
                 document.querySelector(".uploadphotobutton").style.display = "block";
                 //TODO: upload to backend
        /*     }
        };

         
    } */
}


document.querySelector('#logout').addEventListener('click', function(){
    if(localStorage.getItem("userloggedin") != null){
        localStorage.clear();

    }
    window.location.replace("/");
});