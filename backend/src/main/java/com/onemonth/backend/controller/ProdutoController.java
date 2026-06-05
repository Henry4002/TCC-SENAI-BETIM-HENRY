package com.onemonth.backend.controller;


import com.onemonth.backend.model.Produto;
import com.onemonth.backend.repository.ProdutoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class ProdutoController {

    private final ProdutoRepository repository;

    public ProdutoController(ProdutoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/produtos")
    public List<Produto> listarProdutos(){
        return  repository.findAll();
    }

    @GetMapping("/produtos/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {

        Optional<Produto> produto = repository.findById(id);

        if (produto.isPresent()) {
            return ResponseEntity.ok(produto.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/produtos")
    public Produto cadastrarProduto(@RequestBody Produto produto){
        return repository.save(produto);
    }


    @DeleteMapping("/produtos/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id){

        if(!repository.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("produtos/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody Produto produtoAtualizado){

        Optional<Produto> produtoExistente = repository.findById(id);

        if(produtoExistente.isPresent()){

            Produto produto = produtoExistente.get();

            produto.setNome(produtoAtualizado.getNome());
            produto.setDescricao(produtoAtualizado.getDescricao());

            Produto produtoSalvo = repository.save(produto);

            return ResponseEntity.ok(produtoSalvo);
        }

        return ResponseEntity.notFound().build();
    }
}
