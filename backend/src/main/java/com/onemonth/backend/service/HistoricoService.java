package com.onemonth.backend.service;


import com.onemonth.backend.dto.HistoricoDTO;
import com.onemonth.backend.exception.ResourceNotFoundException;
import com.onemonth.backend.exception.ValidationException;
import com.onemonth.backend.model.Historico;
import com.onemonth.backend.repository.HistoricoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;

@Service
public class HistoricoService {

    private final HistoricoRepository repository;

    public HistoricoService(HistoricoRepository repository) {
        this.repository = repository;
    }



    private HistoricoDTO converterParaDTO(Historico historico){
        return new HistoricoDTO(
                historico.getId(),
                historico.getAcao(),
                historico.getDataHistorico(),
                historico.getUsuario().getNome(),
                historico.getProduto().getNome()
        );
    }

    public Historico cadastrarHistorico(Historico historico){

        historico.setDataHistorico(LocalDateTime.now());

        return repository.save(historico);
    }

    public List<HistoricoDTO> listarHistoricos(){

        List<Historico> historicos = repository.findAll();

        List<HistoricoDTO> historicosDTO = new ArrayList<>();

        for(Historico historico : historicos){
            historicosDTO.add(converterParaDTO(historico));
        }
        return historicosDTO;
    }

    public HistoricoDTO buscarPorId(Long id){

        Historico historico = repository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Histórico não encontrado!"));

        return converterParaDTO(historico);

    }

    public Historico atualizarHistorico(Historico historico){


        Historico historicoExistente = repository.findById(historico.getId())
                        .orElseThrow(()-> new ResourceNotFoundException("Histórico não encontrado!"));

        historicoExistente.setAcao(historico.getAcao());
        historicoExistente.setUsuario(historico.getUsuario());
        historicoExistente.setProduto(historico.getProduto());
        historicoExistente.setDataHistorico(LocalDateTime.now());

        return repository.save(historicoExistente);
    }

    public void deletarHistorico(Long id){

        Historico historico = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Histórico não encontrado!"));
        repository.delete(historico);
    }
}
