package com.onemonth.backend.service;


import com.onemonth.backend.dto.VersaoReceitaDTO;
import com.onemonth.backend.exception.ResourceNotFoundException;
import com.onemonth.backend.exception.ValidationException;
import com.onemonth.backend.model.VersaoReceita;
import com.onemonth.backend.repository.VersaoReceitaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VersaoReceitaService {

    private final VersaoReceitaRepository repository;

    public VersaoReceitaService(VersaoReceitaRepository repository) {
        this.repository = repository;
    }

    public void validarVersaoReceita(VersaoReceita versaoReceita){
        if(versaoReceita.getNumeroVersao() <=0){
            throw new ValidationException("Número versão inválido!");
        }
        if(versaoReceita.getDescricao() == null || versaoReceita.getDescricao().isBlank()){
            throw new ValidationException("Descrição obrigatória!");
        }
        if(versaoReceita.getReceita() == null){
            throw new ValidationException("Receita obrigatória!");
        }
    }

    private VersaoReceitaDTO converterParaDTO(VersaoReceita versaoReceita){
        return new VersaoReceitaDTO(
                versaoReceita.getId(),
                versaoReceita.getNumeroVersao(),
                versaoReceita.getDataVersao(),
                versaoReceita.getDescricao(),
                versaoReceita.getReceita().getNome()
        );
    }

    public VersaoReceita cadastrarVersaoReceita(VersaoReceita versaoReceita){
        validarVersaoReceita(versaoReceita);

        versaoReceita.setDataVersao(LocalDate.now());

        return repository.save(versaoReceita);
    }

    public List<VersaoReceitaDTO> listarVersoesReceitas(){
        List<VersaoReceita> versaoReceitas = repository.findAll();

        List<VersaoReceitaDTO> versaoReceitasDTO = new ArrayList<>();

        for(VersaoReceita versaoReceita : versaoReceitas){
            versaoReceitasDTO.add(converterParaDTO(versaoReceita));
        }

        return versaoReceitasDTO;
    }

    public VersaoReceitaDTO buscarPorId(Long id){

        VersaoReceita versaoReceita = repository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Versão-receita não encontrada!"));

        return converterParaDTO(versaoReceita);
    }

    public VersaoReceita atualizarVersaoReceita(VersaoReceita versaoReceita){
        validarVersaoReceita(versaoReceita);

        VersaoReceita versaoReceitaExistente = repository.findById(versaoReceita.getId())
                        .orElseThrow(()-> new ResourceNotFoundException("Versão-receita não encontrada!"));

        versaoReceitaExistente.setNumeroVersao(versaoReceita.getNumeroVersao());
        versaoReceitaExistente.setDescricao(versaoReceita.getDescricao());
        versaoReceitaExistente.setReceita(versaoReceita.getReceita());
        versaoReceitaExistente.setDataVersao(LocalDate.now());

        return repository.save(versaoReceitaExistente);
    }

    public void deletarVersaoReceita(Long id){

        VersaoReceita versaoReceita = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Versão-receita não encontrada!"));

        repository.delete(versaoReceita);
    }
}
