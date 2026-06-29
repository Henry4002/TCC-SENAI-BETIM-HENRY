package com.onemonth.backend.controller;


import com.onemonth.backend.dto.UsuarioDTO;
import com.onemonth.backend.model.Usuario;
import com.onemonth.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<UsuarioDTO> listarUsuarios(){
        return service.listarUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id){

        UsuarioDTO usuario = service.buscarPorId(id);
        return ResponseEntity.ok(usuario);

    }

    @PostMapping
    public Usuario cadastrarUsuario(@RequestBody Usuario usuario){
        return service.cadastrarUsuario(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado){

        usuarioAtualizado.setId(id);
        Usuario usuario = service.atualizarUsuario(usuarioAtualizado);
        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id){
        service.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
