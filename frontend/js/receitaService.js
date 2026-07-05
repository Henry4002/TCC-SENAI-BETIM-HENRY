// ==========================================================================
// CAMADA DE SERVIÇO: RECEITAS E VERSÕES (Mock Back-end LocalStorage)
// ==========================================================================

const ReceitaService = {
    // 1. Listar
    listarReceitas: async () => {
        return JSON.parse(localStorage.getItem('receitas')) || [];
    },

    // 2. Criar Nova Receita Base
    criarReceita: async (nome, idProduto) => {
        const receitas = await ReceitaService.listarReceitas();
        const novaReceita = {
            id: Date.now(), // Simula ID Único do Banco
            nome: nome,
            idProduto: parseInt(idProduto)
        };
        receitas.push(novaReceita);
        localStorage.setItem('receitas', JSON.stringify(receitas));
        return novaReceita;
    },

    // 3. Listar Versões de uma Receita Específica
    listarVersoesPorReceita: async (idReceita) => {
        const versoes = JSON.parse(localStorage.getItem('versoes_receita')) || [];
        return versoes.filter(versao => versao.idReceita === parseInt(idReceita));
    },

    // 4. Criar Nova Versão (Aprovações, Testes, Obsoletas)
    criarVersao: async (numero_versao, data_versao, descricao, idReceita, idStatusVersaoReceita) => {
        const versoes = JSON.parse(localStorage.getItem('versoes_receita')) || [];
        const novaVersao = {
            id: Date.now(),
            numero_versao: numero_versao,
            data_versao: data_versao, 
            descricao: descricao,
            idReceita: parseInt(idReceita),
            idStatusVersaoReceita: parseInt(idStatusVersaoReceita)
        };
        versoes.push(novaVersao);
        localStorage.setItem('versoes_receita', JSON.stringify(versoes));
        return novaVersao;
    }
};