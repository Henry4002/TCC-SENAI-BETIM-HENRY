// ==========================================================
// HISTÓRICO DE ATIVIDADES — dados sempre vêm da API, nunca do localStorage
// ==========================================================

const API_URL = "https://projeto-tcc-senai-production.up.railway.app";
const TAMANHO_PAGINA = 20;

const corpoTabela = document.getElementById("corpoTabelaHistorico");
const mensagemEstado = document.getElementById("mensagemEstado");
const tabela = document.querySelector("#areaHistorico table");
const btnMostrarMais = document.getElementById("btnMostrarMais");

const filtroBusca = document.getElementById("filtroBusca");
const filtroUsuario = document.getElementById("filtroUsuario");
const filtroProduto = document.getElementById("filtroProduto");
const filtroDataInicio = document.getElementById("filtroDataInicio");
const filtroDataFim = document.getElementById("filtroDataFim");
const btnAplicarFiltros = document.getElementById("btnAplicarFiltros");
const btnLimparFiltros = document.getElementById("btnLimparFiltros");

let paginaAtual = 0;
let ultimaPagina = true;
let carregando = false;
let filtrosAtivos = {};

function mostrarEstado(estado) {
    if (estado === "tabela") {
        tabela.style.display = "table";
        mensagemEstado.style.display = "none";
        return;
    }

    tabela.style.display = "none";
    mensagemEstado.style.display = "block";
    mensagemEstado.classList.toggle("erro", estado === "erro");

    const textos = {
        carregando: "Carregando histórico...",
        vazio: "Nenhuma atividade registrada ainda.",
        vazioFiltro: "Nenhum resultado para os filtros aplicados.",
        erro: "Não foi possível carregar o histórico. Tente novamente."
    };

    mensagemEstado.textContent = textos[estado] || "";
}

function formatarData(dataIso) {
    if (!dataIso) return "-";
    return new Date(dataIso).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function renderizarLinhas(itens, substituir) {
    if (substituir) corpoTabela.innerHTML = "";

    itens.forEach((item) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${formatarData(item.dataHistorico)}</td>
            <td>${item.usuario ?? "-"}</td>
            <td title="${item.acao ?? ""}">${item.acao ?? "-"}</td>
            <td>${item.produto ?? "-"}</td>
        `;
        corpoTabela.appendChild(linha);
    });
}

function montarParametros(pagina) {
    const params = new URLSearchParams();
    params.set("page", pagina);
    params.set("size", TAMANHO_PAGINA);

    if (filtrosAtivos.usuarioId) params.set("usuarioId", filtrosAtivos.usuarioId);
    if (filtrosAtivos.produtoId) params.set("produtoId", filtrosAtivos.produtoId);
    if (filtrosAtivos.busca) params.set("busca", filtrosAtivos.busca);
    if (filtrosAtivos.dataInicio) params.set("dataInicio", filtrosAtivos.dataInicio);
    if (filtrosAtivos.dataFim) params.set("dataFim", filtrosAtivos.dataFim);

    return params;
}

async function buscarPagina(pagina) {
    if (carregando) return;
    carregando = true;

    const substituir = pagina === 0;

    if (substituir) {
        mostrarEstado("carregando");
    } else {
        btnMostrarMais.disabled = true;
        btnMostrarMais.textContent = "Carregando...";
    }

    try {
        const params = montarParametros(pagina);
        const resposta = await fetch(`${API_URL}/historico?${params.toString()}`);

        if (!resposta.ok) throw new Error("Falha ao buscar histórico.");

        const dadosPagina = await resposta.json();

        paginaAtual = pagina;
        ultimaPagina = dadosPagina.last;

        renderizarLinhas(dadosPagina.content, substituir);

        const totalNaTela = corpoTabela.querySelectorAll("tr").length;

        if (totalNaTela === 0) {
            mostrarEstado(Object.keys(filtrosAtivos).length > 0 ? "vazioFiltro" : "vazio");
        } else {
            mostrarEstado("tabela");
        }

        btnMostrarMais.style.display = ultimaPagina ? "none" : "inline-block";

    } catch (erro) {
        console.error("Erro ao buscar histórico:", erro);
        mostrarEstado("erro");
    } finally {
        carregando = false;
        btnMostrarMais.disabled = false;
        btnMostrarMais.textContent = "Mostrar mais";
    }
}

async function carregarFiltrosAuxiliares() {
    try {
        const [usuarios, produtos] = await Promise.all([
            fetch(`${API_URL}/usuario`).then((r) => r.json()),
            fetch(`${API_URL}/produtos`).then((r) => r.json())
        ]);

        usuarios.forEach((u) => {
            const opcao = document.createElement("option");
            opcao.value = u.id;
            opcao.textContent = u.nome;
            filtroUsuario.appendChild(opcao);
        });

        produtos.forEach((p) => {
            const opcao = document.createElement("option");
            opcao.value = p.id;
            opcao.textContent = p.nome;
            filtroProduto.appendChild(opcao);
        });

    } catch (erro) {
        console.error("Erro ao carregar filtros auxiliares:", erro);
    }
}

btnAplicarFiltros.addEventListener("click", () => {
    filtrosAtivos = {};

    if (filtroBusca.value.trim()) filtrosAtivos.busca = filtroBusca.value.trim();
    if (filtroUsuario.value) filtrosAtivos.usuarioId = filtroUsuario.value;
    if (filtroProduto.value) filtrosAtivos.produtoId = filtroProduto.value;
    if (filtroDataInicio.value) filtrosAtivos.dataInicio = `${filtroDataInicio.value}T00:00:00`;
    if (filtroDataFim.value) filtrosAtivos.dataFim = `${filtroDataFim.value}T23:59:59`;

    buscarPagina(0);
});

btnLimparFiltros.addEventListener("click", () => {
    filtroBusca.value = "";
    filtroUsuario.value = "";
    filtroProduto.value = "";
    filtroDataInicio.value = "";
    filtroDataFim.value = "";
    filtrosAtivos = {};

    buscarPagina(0);
});

btnMostrarMais.addEventListener("click", () => buscarPagina(paginaAtual + 1));

document.addEventListener("DOMContentLoaded", async () => {
    await carregarFiltrosAuxiliares();
    await buscarPagina(0);
});