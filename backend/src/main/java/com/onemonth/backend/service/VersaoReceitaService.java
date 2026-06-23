package com.onemonth.backend.service;


import com.onemonth.backend.model.VersaoReceita;
import com.onemonth.backend.repository.VersaoReceitaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VersaoReceitaService {

    private final VersaoReceitaRepository repository;

    public VersaoReceitaService(VersaoReceitaRepository repository) {
        this.repository = repository;
    }

    public void validarVersaoReceita(VersaoReceita versaoReceita){
        if(versaoReceita.getNumero_versao() <=0){
            throw new IllegalArgumentException("Número versão inválido!");
        }
        if(versaoReceita.getDescricao() == null || versaoReceita.getDescricao().isBlank()){
            throw new IllegalArgumentException("Descrição obrigatória!");
        }
        if(versaoReceita.getReceita() == null){
            throw new IllegalArgumentException("Receita obrigatória!");
        }
    }

    public void validarExistenciaVersaoReceita(Long id){
        if(!repository.existsById(id)){
            throw new IllegalArgumentException("Versão receita não encontrada!");
        }
    }

    public VersaoReceita cadastrarVersaoReceita(VersaoReceita versaoReceita){
        validarVersaoReceita(versaoReceita);

        versaoReceita.setData_versao(LocalDate.now());

        return repository.save(versaoReceita);
    }

    public List<VersaoReceita> listarVersoesReceitas(){
        return repository.findAll();
    }

    public VersaoReceita buscarPorId(Long id){
        Optional<VersaoReceita> versaoReceita = repository.findById(id);
        if(versaoReceita.isPresent()){
            return versaoReceita.get();
        }
        throw new IllegalArgumentException("Versão receita não encontrada!");
    }

    public VersaoReceita atualizarVersaoReceita(VersaoReceita versaoReceita){
        validarVersaoReceita(versaoReceita);
        validarExistenciaVersaoReceita(versaoReceita.getId());

        VersaoReceita versaoReceitaExistente = buscarPorId(versaoReceita.getId());

        versaoReceitaExistente.setNumero_versao(versaoReceita.getNumero_versao());
        versaoReceitaExistente.setDescricao(versaoReceita.getDescricao());
        versaoReceitaExistente.setReceita(versaoReceita.getReceita());
        versaoReceitaExistente.setData_versao(LocalDate.now());

        return repository.save(versaoReceitaExistente);
    }

    public void deletarVersaoReceita(Long id){

        validarExistenciaVersaoReceita(id);
        repository.deleteById(id);
    }
}
