package com.onemonth.backend.controller;


import com.onemonth.backend.dto.HistoricoDTO;
import com.onemonth.backend.model.Historico;
import com.onemonth.backend.service.HistoricoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/historico")
public class HistoricoController {

    private final HistoricoService service;

    public HistoricoController(HistoricoService service) {
        this.service = service;
    }

    @GetMapping
    public Page<HistoricoDTO> listarHistoricos(
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) Long produtoId,
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size){

        Pageable pageable = PageRequest.of(page, size);

        return service.listarHistoricos(usuarioId, produtoId, busca, dataInicio, dataFim, pageable);
    }
    @GetMapping("/{id}")
    public ResponseEntity<HistoricoDTO> buscarPorId(@PathVariable Long id){

        HistoricoDTO historico = service.buscarPorId(id);
        return ResponseEntity.ok(historico);
    }

    @PostMapping
    public Historico cadastrarHistorico(@Valid @RequestBody Historico historico){
        return service.cadastrarHistorico(historico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Historico> atualizarHistorico(@PathVariable Long id, @Valid @RequestBody Historico historicoAtualizado){

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
