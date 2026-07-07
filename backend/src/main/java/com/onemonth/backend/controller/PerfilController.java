package com.onemonth.backend.controller;

import com.onemonth.backend.model.Perfil;
import com.onemonth.backend.repository.PerfilRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/perfil")
public class PerfilController {

    private final PerfilRepository repository;

    public PerfilController(PerfilRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Perfil> listarPerfis() {
        return repository.findAll();
    }
}