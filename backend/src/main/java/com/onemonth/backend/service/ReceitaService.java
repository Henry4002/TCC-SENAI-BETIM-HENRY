package com.onemonth.backend.service;


import com.onemonth.backend.model.Receita;
import com.onemonth.backend.repository.ReceitaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReceitaService {

    private final ReceitaRepository repository;

    public ReceitaService(ReceitaRepository repository) {
        this.repository = repository;
    }

    public void validarReceita(Receita receita){
        if(receita.getNome() == null || receita.getNome().isBlank()){
            throw new IllegalArgumentException("Nome da receita obrigatório!");
        }
        if(receita.getProduto() == null){
            throw new IllegalArgumentException("Produto obrigatório!");
        }
    }

    public void validarExistenciaReceita(Long id){

        if(!repository.existsById(id)){
            throw new IllegalArgumentException("Receita não encontrada!");
        }
    }

    public Receita cadastrarReceita(Receita receita){
        validarReceita(receita);

        return repository.save(receita);
    }

    public List<Receita> listarReceitas(){
        return repository.findAll();
    }

    public Receita buscarPorId(Long id){
        Optional<Receita> receita = repository.findById(id);

        if(receita.isPresent()){
            return receita.get();
        }
        throw new IllegalArgumentException("Receita não encontrada!");
    }

    public Receita atualizarReceita(Receita receita){
        validarReceita(receita);
        validarExistenciaReceita(receita.getId());

        return repository.save(receita);
    }

    public void deletarReceita(Long id){

        validarExistenciaReceita(id);
        repository.deleteById(id);
    }
}
