const btnLogout = document.getElementById("btnLogout");

btnLogout.addEventListener("click", function(event){

    event.preventDefault();

    window.location.href = "login.html";

});