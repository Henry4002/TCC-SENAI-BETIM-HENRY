const botao = document.getElementById("btnCadastrar");

botao.addEventListener("click", function(){

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if(senha !== confirmarSenha){
        alert("As senhas não coincidem!");
        return;
    }

    console.log(nome);
    console.log(email);
    console.log(usuario);

    alert("Cadastro realizado com sucesso!");
});