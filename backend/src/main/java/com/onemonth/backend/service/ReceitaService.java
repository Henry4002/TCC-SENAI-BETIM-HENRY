package com.onemonth.backend.service;


import com.onemonth.backend.dto.ReceitaDTO;
import com.onemonth.backend.exception.ResourceNotFoundException;
import com.onemonth.backend.exception.ValidationException;
import com.onemonth.backend.model.Receita;
import com.onemonth.backend.repository.ReceitaRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReceitaService {

    private final ReceitaRepository repository;

    public ReceitaService(ReceitaRepository repository) {
        this.repository = repository;
    }



    private ReceitaDTO converterParaDTO(Receita receita){
        return new ReceitaDTO(
                receita.getId(),
                receita.getNome(),
                receita.getProduto().getNome()
        );
    }


    public Receita cadastrarReceita(Receita receita){


        return repository.save(receita);
    }

    public List<ReceitaDTO> listarReceitas(){
        List<Receita> receitas = repository.findAll();

        List<ReceitaDTO> receitasDTO = new ArrayList<>();

        for(Receita receita : receitas){
            receitasDTO.add(converterParaDTO(receita));
        }

        return receitasDTO;
    }

    public ReceitaDTO buscarPorId(Long id){

        Receita receita = repository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Receita não encontrada"));

        return converterParaDTO(receita);
    }

    public Receita atualizarReceita(Receita receita){


        Receita receitaExistente = repository.findById(receita.getId())
                .orElseThrow(()-> new ResourceNotFoundException("Receita não encontrada!"));

        receitaExistente.setNome(receita.getNome());
        receitaExistente.setProduto(receita.getProduto());

        return repository.save(receitaExistente);
    }

    public void deletarReceita(Long id){

        Receita receita = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Receita não encontrada!"));

        repository.delete(receita);
    }
}
