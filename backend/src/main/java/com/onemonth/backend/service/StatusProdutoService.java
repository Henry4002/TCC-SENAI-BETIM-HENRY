package com.onemonth.backend.service;


import com.onemonth.backend.exception.ResourceNotFoundException;
import com.onemonth.backend.exception.ValidationException;
import com.onemonth.backend.model.StatusProduto;
import com.onemonth.backend.repository.StatusProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StatusProdutoService {

    private final StatusProdutoRepository repository;

    public StatusProdutoService(StatusProdutoRepository repository){
        this.repository = repository;
    }

    public void validarStatus(StatusProduto status){
        if(status.getNome() == null || status.getNome().isBlank()){
            throw new ValidationException("Campo nome obrigatório!");
        }
    }

    public StatusProduto cadastrarStatus(StatusProduto status){

        validarStatus(status);

        return repository.save(status);
    }

    public List<StatusProduto> listarStatus(){
        return repository.findAll();
    }

    public StatusProduto buscarPorId(Long id){
        Optional<StatusProduto> statusProduto = repository.findById(id);

        if(statusProduto.isPresent()){
            return statusProduto.get();
        }

        throw new ResourceNotFoundException("Status-produto não encontrado!");
    }

    public StatusProduto atualizarStatus (StatusProduto status){
        validarStatus(status);

        StatusProduto statusProdutoExistente = repository.findById(status.getId())
                .orElseThrow(()-> new ResourceNotFoundException("Status-produto não encontrado!"));

        statusProdutoExistente.setNome(status.getNome());

        return repository.save(statusProdutoExistente);
    }

    public void deletarStatus(Long id){

        StatusProduto statusProduto = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Status-produto não encontrado!"));

        repository.delete(statusProduto);
    }


}
