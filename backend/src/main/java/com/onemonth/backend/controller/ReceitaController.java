package com.onemonth.backend.controller;


import com.onemonth.backend.model.Receita;
import com.onemonth.backend.service.ReceitaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/receita")
public class ReceitaController {

    private final ReceitaService service;

    public ReceitaController(ReceitaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Receita> listarReceitas(){
        return service.listarReceitas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receita> buscarPorId(@PathVariable Long id){

        Receita receita = service.buscarPorId(id);
        return ResponseEntity.ok(receita);
    }

    @PostMapping
    public Receita cadastrarReceita(@RequestBody Receita receita){
        return service.cadastrarReceita(receita);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receita> atualizarReceita(@PathVariable Long id, @RequestBody Receita receitaAtualizada){

        receitaAtualizada.setId(id);
        Receita receita = service.atualizarReceita(receitaAtualizada);
        return ResponseEntity.ok(receita);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarReceita(@PathVariable Long id){

        service.deletarReceita(id);
        return ResponseEntity.noContent().build();
    }
}
