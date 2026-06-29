package com.onemonth.backend.service;


import com.onemonth.backend.dto.ProdutoDTO;
import com.onemonth.backend.exception.ResourceNotFoundException;
import com.onemonth.backend.exception.ValidationException;
import com.onemonth.backend.model.Produto;
import com.onemonth.backend.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
            throw new ValidationException("Campo nome é obrigatório!");
        }
        if(produto.getDescricao() == null || produto.getDescricao().isBlank()){
            throw new ValidationException("Campo descrição é obrigatório!");
        }
        if(produto.getStatusProduto() == null){
            throw new ValidationException("Status obrigatório!");
        }
        if(produto.getUsuario() == null){
            throw new ValidationException("Usuário obrigatório!");
        }
    }

    private ProdutoDTO converterParaDTO(Produto produto){
        return new ProdutoDTO(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getUsuario().getNome(),
                produto.getStatusProduto().getNome()
        );
    }

    public Produto cadastrarProduto(Produto produto){
        validarProduto(produto);

        return repository.save(produto);
    }

    public List<ProdutoDTO> listarProdutos(){
        List<Produto> produtos = repository.findAll();

        List<ProdutoDTO> produtosDTO = new ArrayList<>();

        for(Produto produto : produtos){
            produtosDTO.add(converterParaDTO(produto));
        }
        return produtosDTO;
    }

    public ProdutoDTO buscarPorId(Long id){

        Produto produto = repository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Produto não encontrado!"));

        return converterParaDTO(produto);
    }

    public Produto atualizarProduto (Produto produto){

        validarProduto(produto);

        Produto produtoExistente = repository.findById(produto.getId())
                .orElseThrow(()-> new ResourceNotFoundException("Produto não encontrado!"));

        produtoExistente.setNome(produto.getNome());
        produtoExistente.setDescricao(produto.getDescricao());
        produtoExistente.setUsuario(produto.getUsuario());
        produtoExistente.setStatusProduto(produto.getStatusProduto());


        return repository.save(produtoExistente);
    }

    public void deletarProduto(Long id){

        Produto produto = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Produto não encontrado!"));

        repository.delete(produto);
    }

}
