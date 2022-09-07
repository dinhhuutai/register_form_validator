import validator from "./validator.js";

var changeFormRegister = document.querySelector('#login a[href="#"]');
var changeFormLogin = document.querySelector('#register a[href="#"]');
var formLogin = document.querySelector('#login');

changeFormRegister.onclick = function() {
    formLogin.style.visibility = 'hidden';
}

changeFormLogin.onclick = function() {
    formLogin.style.visibility = 'initial';
}



validator("#register");
validator('#login');
