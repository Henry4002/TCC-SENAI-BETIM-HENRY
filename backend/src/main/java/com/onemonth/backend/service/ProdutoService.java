package com.onemonth.backend.service;


import com.onemonth.backend.model.Produto;
import com.onemonth.backend.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository){
        this.repository = repository;
    }

    public void validarProduto(Produto produto){
        if(produto.getNome() == null || produto.getNome().isBlank()){
            throw new IllegalArgumentException("Campo nome é obrigatório!");
        }
        if(produto.getDescricao() == null || produto.getDescricao().isBlank()){
            throw new IllegalArgumentException("Campo descrição é obrigatório!");
        }
    }

    public void validarExistenciaProduto(Long id){
        if(!repository.existsById(id)){
            throw new IllegalArgumentException("Produto não encontrado!");
        }
    }

    public Produto cadastrarProduto(Produto produto){
        validarProduto(produto);

        return repository.save(produto);
    }

    public List<Produto> listarProdutos(){
        return repository.findAll();
    }

    public Produto buscarPorId(Long id){
        Optional<Produto> produto = repository.findById(id);

        if(produto.isPresent()){
            return produto.get();
        }

        throw new IllegalArgumentException("Produto não encontrado");
    }

    public Produto atualizarProduto (Produto produto){

        validarProduto(produto);

        validarExistenciaProduto(produto.getId());

        return repository.save(produto);
    }

    public void deletarProduto(Long id){

        validarExistenciaProduto(id);

        repository.deleteById(id);
    }

}
