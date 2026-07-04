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



    private VersaoReceitaDTO converterParaDTO(VersaoReceita versaoReceita){
        return new VersaoReceitaDTO(
                versaoReceita.getId(),
                versaoReceita.getNumeroVersao(),
                versaoReceita.getDataVersao(),
                versaoReceita.getDescricao(),
                versaoReceita.getReceita().getNome(),
                versaoReceita.getStatusVersaoReceita().getNome()
        );
    }

    public VersaoReceita cadastrarVersaoReceita(VersaoReceita versaoReceita){


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
