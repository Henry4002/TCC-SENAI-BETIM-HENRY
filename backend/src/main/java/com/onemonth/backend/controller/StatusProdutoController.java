package com.onemonth.backend.controller;


import com.onemonth.backend.model.StatusProduto;
import com.onemonth.backend.service.StatusProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/status")
public class StatusProdutoController {

    private final StatusProdutoService service;

    public StatusProdutoController(StatusProdutoService service){
        this.service = service;
    }

    @GetMapping
    public List<StatusProduto> listarStatus(){

        return service.listarStatus();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StatusProduto> buscarStatusPorId(@PathVariable Long id){

        StatusProduto status = service.buscarPorId(id);
        return ResponseEntity.ok(status);
    }

    @PostMapping
    public StatusProduto cadastrarStatus(@RequestBody StatusProduto status){

        return service.cadastrarStatus(status);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StatusProduto> atualizarStatus(@PathVariable Long id,@RequestBody StatusProduto statusAtualizado){

        statusAtualizado.setId(id);

        StatusProduto status = service.atualizarStatus(statusAtualizado);

        return ResponseEntity.ok(status);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarStatus(@PathVariable Long id){

        service.deletarStatus(id);
        return ResponseEntity.noContent().build();
    }

}
