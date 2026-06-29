package com.onemonth.backend.service;


import com.onemonth.backend.exception.ResourceNotFoundException;
import com.onemonth.backend.exception.ValidationException;
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
            throw new ValidationException("Campo nome obrigatório!");
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

        throw new ResourceNotFoundException("Perfil não encontrado");
    }

    public Perfil atualizarPerfil (Perfil perfil){

        validarPerfil(perfil);

        Perfil perfilExistente = repository.findById(perfil.getId())
                .orElseThrow(()-> new ResourceNotFoundException("Perfil não encontrado!"));

        perfilExistente.setNome(perfil.getNome());

        return repository.save(perfilExistente);
    }

    public void deletarPerfil (Long id){

        Perfil perfil = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Perfil não encontrado!"));

        repository.delete(perfil);
    }
}
