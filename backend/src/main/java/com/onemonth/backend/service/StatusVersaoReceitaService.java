package com.onemonth.backend.service;


import com.onemonth.backend.exception.ResourceNotFoundException;
import com.onemonth.backend.exception.ValidationException;
import com.onemonth.backend.model.StatusVersaoReceita;
import com.onemonth.backend.repository.StatusVersaoReceitaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StatusVersaoReceitaService {

    private final StatusVersaoReceitaRepository repository;

    public StatusVersaoReceitaService(StatusVersaoReceitaRepository repository){
        this.repository = repository;
    }



    public StatusVersaoReceita cadastrarStatus(StatusVersaoReceita status){



        return repository.save(status);
    }

    public List<StatusVersaoReceita> listarStatus(){
        return repository.findAll();
    }

    public StatusVersaoReceita buscarPorId(Long id){
        Optional<StatusVersaoReceita> statusVersaoReceita = repository.findById(id);

        if(statusVersaoReceita.isPresent()){
            return statusVersaoReceita.get();
        }

        throw new ResourceNotFoundException("Status-receita não encontrado!");
    }

    public StatusVersaoReceita atualizarStatus (StatusVersaoReceita status){


        StatusVersaoReceita statusVersaoReceitaExistente = repository.findById(status.getId())
                .orElseThrow(()-> new ResourceNotFoundException("Status-receita não encontrado!"));

        statusVersaoReceitaExistente.setNome(status.getNome());

        return repository.save(statusVersaoReceitaExistente);
    }

    public void deletarStatus(Long id){

        StatusVersaoReceita statusVersaoReceita = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Status-receita não encontrado!"));

        repository.delete(statusVersaoReceita);
    }


}
