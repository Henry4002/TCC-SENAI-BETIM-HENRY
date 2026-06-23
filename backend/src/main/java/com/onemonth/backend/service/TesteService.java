package com.onemonth.backend.service;


import com.onemonth.backend.model.Teste;
import com.onemonth.backend.repository.TesteRepository;
import org.springframework.stereotype.Service;

@Service
public class TesteService {

    private final TesteRepository repository;

    public TesteService(TesteRepository repository) {
        this.repository = repository;
    }

    public void validarTeste (Teste teste){
        if(teste.getResultado() == null || teste.getResultado().isBlank()){
            throw new IllegalArgumentException("Resultado obrigatório!");
        }
        if(teste.getUsuario() == null){
            throw new IllegalArgumentException("Usuário obrigatório!");
        }
        if(teste.getVersaoReceita() == null){
            throw new IllegalArgumentException("Versão receita obrigatória!");
        }
    }

    public void validarExistenciaTeste(Long id){

    }
}
