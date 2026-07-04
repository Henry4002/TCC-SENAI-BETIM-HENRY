package com.onemonth.backend.controller;


import com.onemonth.backend.model.Perfil;
import com.onemonth.backend.repository.PerfilRepository;
import com.onemonth.backend.service.PerfilService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/perfil")
public class PerfilController {

    private final PerfilService service;
    public PerfilController(PerfilService service){
        this.service = service;
    }

    @GetMapping
    public List<Perfil> listarPerfis(){
        return service.listarPerfis();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perfil> buscarPorId(@PathVariable Long id){

        Perfil perfil = service.buscarPorId(id);

        return ResponseEntity.ok(perfil);
    }

    @PostMapping
    public Perfil cadastrarPerfil(@Valid @RequestBody Perfil perfil){

        return service.cadastrarPerfil(perfil);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Perfil> atualizarPerfil (@Valid @RequestBody Perfil perfilAtualizado, @PathVariable Long id){

        perfilAtualizado.setId(id);

        Perfil perfil = service.atualizarPerfil(perfilAtualizado);

        return ResponseEntity.ok(perfil);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPerfil(@PathVariable Long id){

        service.deletarPerfil(id);
        return ResponseEntity.noContent().build();
    }
}
