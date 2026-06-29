package com.onemonth.backend.controller;

import com.onemonth.backend.dto.EstoqueDTO;
import com.onemonth.backend.model.Estoque;
import com.onemonth.backend.service.EstoqueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estoque")
public class EstoqueController {
    private final EstoqueService service;

    public EstoqueController(EstoqueService service) {
        this.service = service;
    }

    @GetMapping
    public List<EstoqueDTO> listarEstoques(){
        return service.listarEstoques();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstoqueDTO> buscarPorId(@PathVariable Long id){

        EstoqueDTO estoque = service.buscarPorId(id);
        return ResponseEntity.ok(estoque);
    }

    @PostMapping
    public Estoque cadastrarEstoque(@RequestBody Estoque estoque){

        return service.cadastrarEstoque(estoque);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estoque> atualizarEstoque(@PathVariable Long id, @RequestBody Estoque estoqueAtualizado){

        estoqueAtualizado.setId(id);

        Estoque estoque = service.atualizarEstoque(estoqueAtualizado);
        return ResponseEntity.ok(estoque);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEstoque(@PathVariable Long id){

        service.deletarEstoque(id);
        return ResponseEntity.noContent().build();
    }

}
