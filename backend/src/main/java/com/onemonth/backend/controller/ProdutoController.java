package com.onemonth.backend.controller;


import com.onemonth.backend.dto.ProdutoDTO;
import com.onemonth.backend.model.Produto;

import com.onemonth.backend.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProdutoDTO> listarProdutos(){
        return  service.listarProdutos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> buscarPorId(@PathVariable Long id) {

        ProdutoDTO produto = service.buscarPorId(id);
        return ResponseEntity.ok(produto);

    }

    @PostMapping
    public Produto cadastrarProduto(@RequestBody Produto produto){
        return service.cadastrarProduto(produto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody Produto produtoAtualizado){

        produtoAtualizado.setId(id);

        Produto produto = service.atualizarProduto(produtoAtualizado);

        return ResponseEntity.ok(produto);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id){

        service.deletarProduto(id);
        return ResponseEntity.noContent().build();

    }
}
