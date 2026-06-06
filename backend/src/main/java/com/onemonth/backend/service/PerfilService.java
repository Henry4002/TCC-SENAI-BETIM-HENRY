package com.onemonth.backend.service;


import com.onemonth.backend.model.Perfil;
import com.onemonth.backend.repository.PerfilRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PerfilService {

    private final PerfilRepository repository;
    public PerfilService(PerfilRepository repository){
        this.repository = repository;
    }

    public void validarPerfil (Perfil perfil){

        if(perfil.getNome() == null || perfil.getNome().isBlank()){
            throw new IllegalArgumentException("Campo nome obrigatório!");
        }

    }

    public void validarExistenciaPerfil(Long id){

        if(!repository.existsById(id)){
            throw new IllegalArgumentException("Perfil não encontrado");
        }
    }

    public Perfil cadastrarPerfil (Perfil perfil){

        validarPerfil(perfil);

        return repository.save(perfil);
    }

    public List<Perfil> listarPerfis(){

        return repository.findAll();
    }

    public Perfil buscarPorId(Long id){
        Optional<Perfil> perfil = repository.findById(id);

        if(perfil.isPresent()){
            return perfil.get();
        }

        throw new IllegalArgumentException("Perfil não encontrado");
    }

    public Perfil atualizarPerfil (Perfil perfil){

        validarPerfil(perfil);
        validarExistenciaPerfil(perfil.getId());

        return repository.save(perfil);
    }

    public void deletarPerfil (Long id){

        validarExistenciaPerfil(id);

        repository.deleteById(id);
    }
}
