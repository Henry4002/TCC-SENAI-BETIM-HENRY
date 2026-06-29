package com.onemonth.backend.controller;


import com.onemonth.backend.dto.HistoricoDTO;
import com.onemonth.backend.model.Historico;
import com.onemonth.backend.service.HistoricoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/historico")
public class HistoricoController {

    private final HistoricoService service;

    public HistoricoController(HistoricoService service) {
        this.service = service;
    }

    @GetMapping
    public List<HistoricoDTO> listarHistoricos(){
        return service.listarHistoricos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoricoDTO> buscarPorId(@PathVariable Long id){

        HistoricoDTO historico = service.buscarPorId(id);
        return ResponseEntity.ok(historico);
    }

    @PostMapping
    public Historico cadastrarHistorico(@RequestBody Historico historico){
        return service.cadastrarHistorico(historico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Historico> atualizarHistorico(@PathVariable Long id, @RequestBody Historico historicoAtualizado){

        historicoAtualizado.setId(id);
        Historico historico = service.atualizarHistorico(historicoAtualizado);

        return ResponseEntity.ok(historico);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarHistorico(@PathVariable Long id){

        service.deletarHistorico(id);
        return ResponseEntity.noContent().build();
    }
}
