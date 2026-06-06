package com.onemonth.backend.service;


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
            throw new IllegalArgumentException("Campo nome obrigatório!");
        }
    }

    public void validarExistenciaStatus(Long id){
        if(!repository.existsById(id)){
            throw new IllegalArgumentException("Status não encontrado!");
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

        throw new IllegalArgumentException("Status não encontrado!");
    }

    public StatusProduto atualizarStatus (StatusProduto status){
        validarStatus(status);

        validarExistenciaStatus(status.getId());

        return repository.save(status);
    }

    public void deletarStatus(Long id){

        validarExistenciaStatus(id);

        repository.deleteById(id);
    }


}
