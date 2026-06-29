package com.onemonth.backend.service;


import com.onemonth.backend.dto.TesteDTO;
import com.onemonth.backend.exception.ResourceNotFoundException;
import com.onemonth.backend.exception.ValidationException;
import com.onemonth.backend.model.Teste;
import com.onemonth.backend.repository.TesteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TesteService {

    private final TesteRepository repository;

    public TesteService(TesteRepository repository) {
        this.repository = repository;
    }

    public void validarTeste (Teste teste){
        if(teste.getResultado() == null || teste.getResultado().isBlank()){
            throw new ValidationException("Resultado obrigatório!");
        }
        if(teste.getUsuario() == null){
            throw new ValidationException("Usuário obrigatório!");
        }
        if(teste.getVersaoReceita() == null){
            throw new ValidationException("Versão receita obrigatória!");
        }
    }

    private TesteDTO converterParaDTO(Teste teste){
        return new TesteDTO(
                teste.getId(),
                teste.getDataTeste(),
                teste.getResultado(),
                teste.getUsuario().getNome(),
                teste.getVersaoReceita().getReceita().getNome(),
                teste.getVersaoReceita().getNumeroVersao()
        );
    }

    public Teste cadastrarTeste(Teste teste){
        validarTeste(teste);
        teste.setDataTeste(LocalDateTime.now());

        return repository.save(teste);
    }

    public List<TesteDTO> listarTestes(){
        List<Teste> testes = repository.findAll();

        List<TesteDTO> testesDTO = new ArrayList<>();

        for(Teste teste : testes){
            testesDTO.add(converterParaDTO(teste));
        }

        return testesDTO;
    }

    public TesteDTO buscarPorId(Long id){

        Teste teste = repository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Teste não encontrado!"));

        return converterParaDTO(teste);
    }

    public Teste atualizarTeste(Teste teste){
        validarTeste(teste);

        Teste testeExistente = repository.findById(teste.getId())
                        .orElseThrow(()-> new ResourceNotFoundException("Teste não encontrado!"));

        testeExistente.setResultado(teste.getResultado());
        testeExistente.setUsuario(teste.getUsuario());
        testeExistente.setVersaoReceita(teste.getVersaoReceita());
        testeExistente.setDataTeste(LocalDateTime.now());

        return repository.save(testeExistente);
    }

    public void deletarTeste(Long id){

        Teste teste = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Teste não encontrado!"));

        repository.delete(teste);
    }

}
