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

    public void validarEstoque(Estoque estoque){

        if(estoque.getQtdMinima() <= 0 || estoque.getQuantidade() <= 0){
            throw new ValidationException("Quantidade inválida!");
        }
        if(estoque.getProduto()== null){
            throw new ValidationException("Produto obrigatório!");
        }
    }

    private EstoqueDTO converterParaDTO(Estoque estoque){
        return new EstoqueDTO(
                estoque.getId(),
                estoque.getDataAtualizacao(),
                estoque.getQtdMinima(),
                estoque.getQuantidade(),
                estoque.getProduto().getNome()
        );
    }


    public Estoque cadastrarEstoque(Estoque estoque){
        validarEstoque(estoque);

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

        validarEstoque(estoque);

        Estoque estoqueExistente = repository.findById(estoque.getId())
                        .orElseThrow(()-> new ResourceNotFoundException("Estoque não encontrado!"));

        estoqueExistente.setQuantidade(estoque.getQuantidade());
        estoqueExistente.setQtdMinima(estoque.getQtdMinima());
        estoqueExistente.setProduto(estoque.getProduto());
        estoqueExistente.setDataAtualizacao(LocalDateTime.now());

        return repository.save(estoqueExistente);
    }

    public void deletarEstoque(Long id){

        Estoque estoque = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Estoque não encontrado!"));
        repository.delete(estoque);
    }
}
