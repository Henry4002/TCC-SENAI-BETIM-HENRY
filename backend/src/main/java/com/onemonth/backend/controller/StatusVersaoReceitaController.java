package com.onemonth.backend.controller;


import com.onemonth.backend.model.StatusVersaoReceita;
import com.onemonth.backend.service.StatusVersaoReceitaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/status")
public class StatusVersaoReceitaController {

    private final StatusVersaoReceitaService service;

    public StatusVersaoReceitaController(StatusVersaoReceitaService service){
        this.service = service;
    }

    @GetMapping
    public List<StatusVersaoReceita> listarStatus(){

        return service.listarStatus();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StatusVersaoReceita> buscarStatusPorId(@PathVariable Long id){

        StatusVersaoReceita status = service.buscarPorId(id);
        return ResponseEntity.ok(status);
    }

    @PostMapping
    public StatusVersaoReceita cadastrarStatus(@Valid @RequestBody StatusVersaoReceita status){

        return service.cadastrarStatus(status);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StatusVersaoReceita> atualizarStatus(@PathVariable Long id, @Valid @RequestBody StatusVersaoReceita statusAtualizado){

        statusAtualizado.setId(id);

        StatusVersaoReceita status = service.atualizarStatus(statusAtualizado);

        return ResponseEntity.ok(status);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarStatus(@PathVariable Long id){

        service.deletarStatus(id);
        return ResponseEntity.noContent().build();
    }

}
