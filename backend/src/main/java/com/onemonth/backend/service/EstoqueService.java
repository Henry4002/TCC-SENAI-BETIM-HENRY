package com.onemonth.backend.service;


import com.onemonth.backend.dto.EstoqueDTO;
import com.onemonth.backend.exception.ResourceNotFoundException;
import com.onemonth.backend.exception.ValidationException;
import com.onemonth.backend.model.Estoque;
import com.onemonth.backend.repository.EstoqueRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EstoqueService {

    private final EstoqueRepository repository;


    public EstoqueService(EstoqueRepository repository) {
        this.repository = repository;

    }



        private EstoqueDTO converterParaDTO(Estoque estoque){
            return new EstoqueDTO(
                    estoque.getId(),
                    estoque.getDataAtualizacao(),
                    estoque.getQtdMinima(),
                    estoque.getQuantidade(),
                    estoque.getDataFabricacao(),
                    estoque.getDataValidade(),
                    estoque.getLote(),
                    estoque.getStatusValidade().name(),
                    estoque.getProduto().getNome()
            );
        }


    public Estoque cadastrarEstoque(Estoque estoque){

        if(estoque.getDataFabricacao().isAfter(estoque.getDataValidade())){
            throw new ValidationException("A data de fabricação não pode ser posterior à data de validade!");
        }
        estoque.setDataAtualizacao(LocalDateTime.now());

        return repository.save(estoque);
    }

    public List<EstoqueDTO> listarEstoques(){
        List<Estoque> estoques = repository.findAll();

        List<EstoqueDTO> estoquesDTO = new ArrayList<>();

        for(Estoque estoque : estoques){
            estoquesDTO.add(converterParaDTO(estoque));
        }

        return estoquesDTO;
    }

    public EstoqueDTO buscarPorId(Long id){

        Estoque estoque = repository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Estoque não encontrado!"));

        return converterParaDTO(estoque);
    }

    public Estoque atualizarEstoque(Estoque estoque){



        Estoque estoqueExistente = repository.findById(estoque.getId())
                        .orElseThrow(()-> new ResourceNotFoundException("Estoque não encontrado!"));

        estoqueExistente.setQuantidade(estoque.getQuantidade());
        estoqueExistente.setQtdMinima(estoque.getQtdMinima());
        estoqueExistente.setProduto(estoque.getProduto());
        estoqueExistente.setLote(estoque.getLote());
        estoqueExistente.setDataValidade(estoque.getDataValidade());
        estoqueExistente.setDataFabricacao(estoque.getDataFabricacao());

        return repository.save(estoqueExistente);
    }

    public void deletarEstoque(Long id){

        Estoque estoque = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Estoque não encontrado!"));
        repository.delete(estoque);
    }
}
