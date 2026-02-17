document.querySelector('#logout').addEventListener('click', function(){
    if(localStorage.getItem("userloggedin") != null){
        localStorage.clear();

    }
    window.location.replace("/");
});

if (window.location.href.indexOf("auth/addspeaker") > -1) {window.location.replace("/eventdesc");}
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

if (window.location.href.indexOf("auth/addguest") > -1) {window.location.replace("/eventdesc");}
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


if (window.location.href.indexOf("auth/eventdesc") > -1) {window.location.replace("/eventdesc");}
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

document.getElementById("addspeakerbutton").addEventListener('click', function(){
    document.querySelector('.bg-modal-addspeakers').style.display = 'flex';
    window.scrollTo(0,0);
    document.body.style.overflow= "hidden";
});

document.querySelector('.closeaddspeakers').addEventListener('click', function(){
    document.querySelector('.bg-modal-addspeakers').style.display = 'none';
    document.body.style.overflow= "auto";
});

document.getElementById("addguestbutton").addEventListener('click', function(){
    document.querySelector('.bg-modal-addguests').style.display = 'flex';
    window.scrollTo(0,0);
    document.body.style.overflow= "hidden";
});

document.querySelector('.closeaddguests').addEventListener('click', function(){
    document.querySelector('.bg-modal-addguests').style.display = 'none';
    document.body.style.overflow= "auto";
});

function validateaddspeaker(){
    const name = document.getElementById("addspeakername").value;
    const topic = document.getElementById("addspeakertopic").value;
    const prof = document.getElementById("addspeakerprofession").value;
   


    if(name.length=="" || topic.length =="" || prof.length ==""){
        return false;
    }else{
        true;
    }
    
} 

function validateaddguests(){
    const name = document.getElementById("addguestname").value;
    const phno = document.getElementById("addguestphno").value;
    const gender = document.getElementById("addguestgender").value;
   
    var regex = /^[-+]?[0-9]+\.{0,1}[0-9]+$/;
    if(!regex.test(phno)){
        return false;
    }else{
        if(phno.length<10){return false;}
        else{
        return true;
        }
    }

    if(name.length=="" || gender.length =="" || phno.length ==""){
        return false;
    }else{
        true;
    }
    
}