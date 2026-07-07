// ======================================================
// ELEMENTOS
// ======================================================
let usuarioEmEdicao = null;
const API_URL = "https://projeto-tcc-senai-production.up.railway.app";

const formCadastro = document.getElementById("formCadastro");

const usuario = document.getElementById("usuario");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");

const erroNome = document.getElementById("erroNome");
const erroEmail = document.getElementById("erroEmail");
const erroUsuario = document.getElementById("erroUsuario");
const erroSenha = document.getElementById("erroSenha");
const erroConfirmarSenha = document.getElementById("erroConfirmarSenha");
const erroTipoUsuario = document.getElementById("erroTipoUsuario");

const barraForca = document.getElementById("barraForca");
const textoForca = document.getElementById("textoForca");

const toggleSenha = document.getElementById("toggleSenha");
const toggleConfirmar = document.getElementById("toggleConfirmar");

const btnCadastrar = document.getElementById("btnCadastrar");




// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function limparErro(elemento){

    elemento.textContent = "";
    elemento.style.display = "none";

}

function mostrarErro(elemento,input,mensagem){

    elemento.textContent = mensagem;
    elemento.style.display = "block";

    input.parentElement.classList.remove("sucesso");
    input.parentElement.classList.add("erroCampo");

}

function mostrarSucesso(input){

    input.parentElement.classList.remove("erroCampo");
    input.parentElement.classList.add("sucesso");

}

function limparCampo(input){

    input.parentElement.classList.remove("erroCampo");
    input.parentElement.classList.remove("sucesso");

}


// ======================================================
// MOSTRAR / OCULTAR SENHA
// ======================================================

toggleSenha.addEventListener("click", () => {
    if (senha.type === "password") {
        senha.type = "text";
        toggleSenha.classList.remove("fa-eye");
        toggleSenha.classList.add("fa-eye-slash");
    } else {
        senha.type = "password";
        toggleSenha.classList.remove("fa-eye-slash");
        toggleSenha.classList.add("fa-eye");
    }
});

toggleConfirmar.addEventListener("click", () => {
    if (confirmarSenha.type === "password") {
        confirmarSenha.type = "text";
        toggleConfirmar.classList.remove("fa-eye");
        toggleConfirmar.classList.add("fa-eye-slash");
    } else {
        confirmarSenha.type = "password";
        toggleConfirmar.classList.remove("fa-eye-slash");
        toggleConfirmar.classList.add("fa-eye");
    }
});


// ======================================================
// VALIDAÇÃO NOME
// ======================================================

function validarNome(){

    limparErro(erroNome);

    const valor = nome.value.trim();

    if(valor==""){

        limparCampo(nome);

        return false;

    }

    if(valor.length<3){

        mostrarErro(
            erroNome,
            nome,
            "O nome deve possuir pelo menos 3 letras."
        );

        return false;

    }

    mostrarSucesso(nome);

    return true;

}


// ======================================================
// EMAIL
// ======================================================

function validarEmail(){

    limparErro(erroEmail);

    const valor = email.value.trim();

    if(valor==""){

        limparCampo(email);

        return false;

    }

    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!regex.test(valor)){

        mostrarErro(
            erroEmail,
            email,
            "Digite um e-mail válido."
        );

        return false;

    }

    mostrarSucesso(email);

    return true;

}


// ======================================================
// USUÁRIO
// ======================================================

function validarUsuario(){

    limparErro(erroUsuario);

    const valor = usuario.value.trim();

    if(valor==""){

        limparCampo(usuario);

        return false;

    }

    if(valor.length<4){

        mostrarErro(
            erroUsuario,
            usuario,
            "O usuário deve possuir pelo menos 4 caracteres."
        );

        return false;

    }

    if(valor.length>20){

        mostrarErro(
            erroUsuario,
            usuario,
            "Máximo de 20 caracteres."
        );

        return false;

    }

    mostrarSucesso(usuario);

    return true;

}


// ======================================================
// SENHA
// ======================================================

function validarSenha(){

    limparErro(erroSenha);

    const valor = senha.value;

    if(valor==""){

        barraForca.style.width="0%";
        textoForca.textContent="";

        if(usuarioEmEdicao !== null){

            mostrarErro(
                erroSenha,
                senha,
                "Por segurança, defina uma nova senha para salvar as alterações."
            );

        } else {

            limparCampo(senha);

        }

        return false;

    }

    let forca=0;

    if(valor.length>=8)forca++;

    if(/[A-Z]/.test(valor))forca++;

    if(/[0-9]/.test(valor))forca++;

    if(/[^A-Za-z0-9]/.test(valor))forca++;

    switch(forca){

        case 1:

            barraForca.style.width="25%";
            barraForca.style.background="#dc3545";
            textoForca.textContent="Senha fraca";

            break;

        case 2:

            barraForca.style.width="50%";
            barraForca.style.background="#ffc107";
            textoForca.textContent="Senha média";

            break;

        case 3:

            barraForca.style.width="75%";
            barraForca.style.background="#0dcaf0";
            textoForca.textContent="Senha boa";

            break;

        case 4:

            barraForca.style.width="100%";
            barraForca.style.background="#198754";
            textoForca.textContent="Senha forte";

            break;

    }

    if(valor.length<8){

        mostrarErro(
            erroSenha,
            senha,
            "A senha deve possuir pelo menos 8 caracteres."
        );

        return false;

    }

    if(!/[A-Z]/.test(valor)){

        mostrarErro(
            erroSenha,
            senha,
            "Inclua uma letra maiúscula."
        );

        return false;

    }

    if(!/[0-9]/.test(valor)){

        mostrarErro(
            erroSenha,
            senha,
            "Inclua um número."
        );

        return false;

    }

    mostrarSucesso(senha);

    return true;

}


// ======================================================
// CONFIRMAR SENHA
// ======================================================

function validarConfirmarSenha(){

    limparErro(erroConfirmarSenha);

    if(confirmarSenha.value==""){

        limparCampo(confirmarSenha);

        return false;

    }

    if(confirmarSenha.value!==senha.value){

        mostrarErro(
            erroConfirmarSenha,
            confirmarSenha,
            "As senhas não coincidem."
        );

        return false;

    }

    mostrarSucesso(confirmarSenha);

    return true;

}


// ======================================================
// TIPO DE USUÁRIO
// ======================================================

function validarTipoUsuario() {
    const selecionado = document.querySelector('input[name="tipoUsuario"]:checked');

    if (!selecionado) {
        erroTipoUsuario.textContent = "Selecione um perfil de acesso válido.";
        erroTipoUsuario.style.display = "block";
        return false;
    }

    limparErro(erroTipoUsuario);
    return true;
}


// ======================================================
// EVENTOS
// ======================================================

nome.addEventListener("input",validarNome);

email.addEventListener("input",validarEmail);

usuario.addEventListener("input",validarUsuario);

senha.addEventListener("input",()=>{

    validarSenha();

    validarConfirmarSenha();

});

confirmarSenha.addEventListener("input",validarConfirmarSenha);


// ======================================================
// SUBMIT (CONECTADO NA API CONFIGURADO PARA SPRING BOOT)
// ======================================================
formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const valido =
        validarNome() &&
        validarEmail() &&
        // Se você não usa 'usuario' (nickname) no banco, pode remover essa validação
        // validarUsuario() && 
        validarSenha() &&
        validarConfirmarSenha() &&
        validarTipoUsuario();

    if (!valido) return;

    // Obtém o ID do perfil selecionado na tela (deve ser um número correspondente ao ID no banco)
    const idPerfilSelecionado = document.querySelector('input[name="tipoUsuario"]:checked').value;

    // Monta o objeto EXATAMENTE como a API mapeia na classe Usuario.java
    const dadosUsuario = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        senha: senha.value,
        perfil: {
            id: parseInt(idPerfilSelecionado) // Transforma em número para o Long do Java
        }
    };

    // Desativa o botão enquanto carrega para o usuário não clicar 2 vezes
    btnCadastrar.disabled = true;
    btnCadastrar.textContent = "Processando...";

    try {
        if (usuarioEmEdicao !== null) {
            // MODO EDIÇÃO: Envia um PUT para a API atualizar o usuário (usando o ID)
            const resposta = await fetch(`${API_URL}/usuario/${usuarioEmEdicao}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: usuarioEmEdicao, // O seu UsuarioController recebe o objeto completo no corpo
                    ...dadosUsuario
                })
            });

            if (!resposta.ok) throw new Error("Erro ao atualizar o colaborador.");

            alert("Colaborador atualizado com sucesso!");
            usuarioEmEdicao = null; // Limpa o estado de edição
            btnCadastrar.textContent = "Cadastrar Colaborador";

            // Volta os campos de senha ao estado normal (modo cadastro)
            senha.placeholder = "Crie uma senha forte";
            confirmarSenha.placeholder = "Repita a senha";
            limparCampo(senha);
            limparErro(erroSenha);
            
        } else {
            // MODO CRIAÇÃO: Envia um POST para a API salvar o novo usuário
            const resposta = await fetch(`${API_URL}/usuario`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosUsuario)
            });

            if (!resposta.ok) {
                // Tenta ler a mensagem de erro vinda do Spring Boot
                try {
                    const erro = await resposta.json();
                    throw new Error(erro.message || "Erro ao cadastrar. Verifique os dados.");
                } catch (e) {
                    throw new Error("E-mail já cadastrado ou dados inválidos.");
                }
            }

            alert("Colaborador cadastrado com sucesso!");
        }

        formCadastro.reset();
        listarUsuarios(); // Puxa a lista nova do banco de dados

    } catch (erro) {
        alert(erro.message); // Mostra o erro na tela
    } finally {
        // Devolve o botão ao normal
        btnCadastrar.disabled = false;
        if(usuarioEmEdicao === null) btnCadastrar.textContent = "Cadastrar Colaborador";
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    await carregarPerfis();
    await listarUsuarios();
});
// ==========================================================
// MOTOR DA BARRA DE FORÇA DE SENHA
// ==========================================================
const inputSenhaForca = document.getElementById('senha');
const barraDeForca = document.getElementById('barraForca');
const textoDeForca = document.getElementById('textoForca');

if (inputSenhaForca && barraDeForca) {
    inputSenhaForca.addEventListener('input', function() {
        const valor = this.value;
        let forca = 0;

        // Regras de força (cada uma vale 25%)
        if (valor.length >= 8) forca += 25; // Tamanho
        if (/[A-Z]/.test(valor)) forca += 25; // Letra Maiúscula
        if (/[0-9]/.test(valor)) forca += 25; // Número
        if (/[^A-Za-z0-9]/.test(valor)) forca += 25; // Símbolo Especial

        // Atualiza a largura da barra
        barraDeForca.style.width = forca + '%';

        // Altera a cor e o texto baseado na pontuação
        if (valor.length === 0) {
            barraDeForca.style.width = '0%';
            textoDeForca.textContent = '';
        } else if (forca <= 25) {
            barraDeForca.style.backgroundColor = '#ff4d4d'; // Vermelho
            textoDeForca.textContent = 'Senha Fraca';
            textoDeForca.style.color = '#ff4d4d';
        } else if (forca <= 50) {
            barraDeForca.style.backgroundColor = '#ffa64d'; // Laranja
            textoDeForca.textContent = 'Senha Razoável';
            textoDeForca.style.color = '#ffa64d';
        } else if (forca <= 75) {
            barraDeForca.style.backgroundColor = '#DE9E52'; // Caramelo (Sua cor)
            textoDeForca.textContent = 'Senha Boa';
            textoDeForca.style.color = '#DE9E52';
        } else {
            barraDeForca.style.backgroundColor = '#28a745'; // Verde
            textoDeForca.textContent = 'Senha Forte';
            textoDeForca.style.color = '#28a745';
        }
    });
}
// ======================================================
// PERFIS (busca dinâmica na API — evita IDs fixos no HTML)
// ======================================================
async function carregarPerfis() {
    const container = document.getElementById("opcoesCargo");
    if (!container) return;

    try {
        const resposta = await fetch(`${API_URL}/perfil`);
        if (!resposta.ok) throw new Error("Não foi possível carregar os perfis.");

        const perfis = await resposta.json();

        container.innerHTML = "";
        perfis.forEach((p) => {
            const label = document.createElement("label");
            label.innerHTML = `
                <input type="radio" name="tipoUsuario" value="${p.id}" data-nome="${p.nome}" required>
                ${p.nome}
            `;
            container.appendChild(label);
        });
    } catch (erro) {
        container.innerHTML = "<p class='erro' style='display:block;'>Erro ao carregar os perfis.</p>";
        console.error("Erro ao carregar perfis:", erro);
    }
}
// ======================================================
// TABELA E AÇÕES (CONECTADAS NA API)
// ======================================================

// Função assíncrona para buscar os usuários na API
async function listarUsuarios() {
    const listaContainer = document.getElementById("listaUsuarios");
    if (!listaContainer) return;

    listaContainer.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Carregando colaboradores...</td></tr>";

    try {
        // Faz a busca na rota do Java
        const resposta = await fetch(`${API_URL}/usuario`);
        
        // Se der erro 404, avisa detalhadamente no console
        if (!resposta.ok) {
            console.error(`Erro do Servidor: Status ${resposta.status} na rota /usuarios`);
            throw new Error("Rota não encontrada no servidor.");
        }

        const usuarios = await resposta.json(); 
        
        if (usuarios.length === 0) {
            listaContainer.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Nenhum colaborador cadastrado.</td></tr>";
            return;
        }

        listaContainer.innerHTML = "";
        usuarios.forEach((u) => {
            // Note que seu UsuarioDTO do Java usa 'perfil' como String (u.perfil)
            listaContainer.innerHTML += `
                <tr>
                    <td>${u.nome}</td>
                    <td>${u.email}</td>
                    <td>${u.perfil || 'Não informado'}</td>
                    <td>
                        <div class="grupo-acoes">
                            <button class="btn-acao editar" onclick="prepararEdicao(${u.id})">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn-acao excluir" onclick="deletarUsuario(${u.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (erro) {
        listaContainer.innerHTML = `<tr><td colspan='4' style='text-align:center; color:red;'>Falha ao carregar os dados.</td></tr>`;
        console.error("Detalhes do erro na listagem:", erro);
    }
}

// Quando clicar em DELETAR na tabela
window.deletarUsuario = async function(id) {
    if (confirm("Tem certeza que deseja excluir este colaborador definitivamente?")) {
        try {
            // Manda a ordem de DELETE para a rota correspondente ao UsuarioService.deletarUsuario
            const resposta = await fetch(`${API_URL}/usuario/${id}`, { method: "DELETE" });
            
            if (resposta.ok) {
                alert("Colaborador excluído com sucesso!");
                listarUsuarios(); // Recarrega a tabela limpa
            } else {
                throw new Error("Erro ao excluir.");
            }
        } catch (erro) {
            alert("Não foi possível excluir o colaborador.");
        }
    }
};


// Apenas UMA função de preparar edição (conectada ao seu Java)
window.prepararEdicao = async function(id) {
    try {
        // Busca o usuário específico pelo ID no back-end Java
        const resposta = await fetch(`${API_URL}/usuario/${id}`);
        
        if (!resposta.ok) {
            throw new Error(`Erro no servidor: Status ${resposta.status}`);
        }

        const u = await resposta.json();

        // Preenche os inputs da tela com os dados reais do banco
        nome.value = u.nome;
        email.value = u.email;
        
        // Deixamos as senhas em branco por segurança (se o admin não digitar nada, mantém a atual)
        if (typeof senha !== 'undefined') senha.value = "";
        if (typeof confirmarSenha !== 'undefined') confirmarSenha.value = "";

        // Marca o botão de rádio correto comparando com a String do Perfil vinda do Java DTO
        // Certifique-se de que o value no HTML seja exatamente igual ao que vem do banco (ex: "Administrador")
        const radio = document.querySelector(`input[name="tipoUsuario"][data-nome="${u.perfil}"]`);
        if (radio) radio.checked = true;

        // Avisa visualmente o botão que o modo atual mudou para edição
        // Avisa visualmente o botão que o modo atual mudou para edição
        if (typeof btnCadastrar !== 'undefined') {
            btnCadastrar.textContent = "Salvar Alterações";
        }

        // Deixa óbvio pro admin: precisa digitar uma senha NOVA pra salvar
        if (typeof senha !== 'undefined') {
            senha.placeholder = "Digite a nova senha (obrigatório)";
            senha.parentElement.classList.add("erroCampo");
        }
        if (typeof confirmarSenha !== 'undefined') {
            confirmarSenha.placeholder = "Repita a nova senha";
        }
        if (typeof erroSenha !== 'undefined') {
            erroSenha.textContent = "Por segurança, defina uma nova senha para salvar as alterações.";
            erroSenha.style.display = "block";
        }
        
        // 🌟 PASSO CRUCIAL: Guarda o ID numérico do Java na nossa variável global de controle
        usuarioEmEdicao = id; 

        // Rola a tela suavemente para o topo para o formulário ficar visível
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (erro) {
        console.error("Erro ao preparar edição:", erro);
        alert("Erro ao buscar os dados do usuário para edição.");
    }
};

