package com.onemonth.backend.controller;


import com.onemonth.backend.dto.TesteDTO;
import com.onemonth.backend.model.Teste;
import com.onemonth.backend.service.TesteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teste")
public class TesteController {

    private final TesteService service;

    public TesteController(TesteService service) {
        this.service = service;
    }

    @GetMapping
    public List<TesteDTO> listarTestes(){
        return service.listarTestes();

    }

    @GetMapping("/{id}")
    public ResponseEntity<TesteDTO> buscarPorId(@PathVariable Long id){

        TesteDTO teste = service.buscarPorId(id);
        return ResponseEntity.ok(teste);
    }

    @PostMapping
    public Teste cadastrarTeste(@Valid @RequestBody Teste teste){
        return service.cadastrarTeste(teste);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teste> atualizarTeste(@PathVariable Long id, @Valid @RequestBody Teste testeAtualizado){

        testeAtualizado.setId(id);
        Teste teste = service.atualizarTeste(testeAtualizado);

        return ResponseEntity.ok(teste);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTeste(@PathVariable Long id){

        service.deletarTeste(id);
        return ResponseEntity.noContent().build();

    }
}
