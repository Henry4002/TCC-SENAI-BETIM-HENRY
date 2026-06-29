package com.onemonth.backend.controller;


import com.onemonth.backend.dto.VersaoReceitaDTO;
import com.onemonth.backend.model.VersaoReceita;
import com.onemonth.backend.service.VersaoReceitaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/versaoreceita")
public class VersaoReceitaController {

    private final VersaoReceitaService service;

    public VersaoReceitaController(VersaoReceitaService service) {
        this.service = service;
    }

    @GetMapping
    public List<VersaoReceitaDTO> listarVersoesReceitas(){
        return service.listarVersoesReceitas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VersaoReceitaDTO> buscarPorId(@PathVariable Long id){

        VersaoReceitaDTO versaoReceita = service.buscarPorId(id);
        return ResponseEntity.ok(versaoReceita);
    }

    @PostMapping
    public VersaoReceita cadastrarVersaoReceita(@RequestBody VersaoReceita versaoReceita){
        return service.cadastrarVersaoReceita(versaoReceita);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VersaoReceita> atualizarVersaoReceita(@PathVariable Long id, @RequestBody VersaoReceita versaoReceitaAtualizada){

        versaoReceitaAtualizada.setId(id);
        VersaoReceita versaoReceita = service.atualizarVersaoReceita(versaoReceitaAtualizada);

        return ResponseEntity.ok(versaoReceita);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarVersaoReceita(@PathVariable Long id){

        service.deletarVersaoReceita(id);
        return ResponseEntity.noContent().build();
    }

}
