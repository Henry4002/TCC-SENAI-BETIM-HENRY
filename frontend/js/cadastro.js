const btnCadastrar = document.getElementById("btnCadastrar");

btnCadastrar.addEventListener("click", function(){

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

    const tipoUsuario = document.querySelector(
        'input[name="tipoUsuario"]:checked'
    );

    if(
        nome === "" ||
        email === "" ||
        usuario === "" ||
        senha === "" ||
        confirmarSenha === ""
    ){
        alert("Preencha todos os campos!");
        return;
    }

    if(!tipoUsuario){
        alert("Selecione um tipo de usuário!");
        return;
    }

    if(senha !== confirmarSenha){
        alert("As senhas não coincidem!");
        return;
    }

    alert("Cadastro realizado com sucesso!");

    window.location.href = "login.html";

});