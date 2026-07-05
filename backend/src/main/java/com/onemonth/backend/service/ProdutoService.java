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


    private ProdutoDTO converterParaDTO(Produto produto){
        return new ProdutoDTO(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getCategoria(),
                produto.getUsuario().getNome()

        );
    }

    public Produto cadastrarProduto(Produto produto){
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



        Produto produtoExistente = repository.findById(produto.getId())
                .orElseThrow(()-> new ResourceNotFoundException("Produto não encontrado!"));

        produtoExistente.setNome(produto.getNome());
        produtoExistente.setDescricao(produto.getDescricao());
        produtoExistente.setCategoria(produto.getCategoria());
        produtoExistente.setUsuario(produto.getUsuario());

        return repository.save(produtoExistente);
    }

    public void deletarProduto(Long id){

        Produto produto = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Produto não encontrado!"));

        repository.delete(produto);
    }

}
