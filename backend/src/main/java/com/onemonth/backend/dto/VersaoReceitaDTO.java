package com.onemonth.backend.dto;

import java.time.LocalDate;

public class VersaoReceitaDTO {

    private Long id;
    private int numeroVersao;
    private LocalDate dataVersao;
    private String descricao;
    private String receita;
    private String status;

    public VersaoReceitaDTO() {
    }

    public VersaoReceitaDTO(Long id, int numeroVersao, LocalDate dataVersao, String descricao, String receita, String status) {
        this.id = id;
        this.numeroVersao = numeroVersao;
        this.dataVersao = dataVersao;
        this.descricao = descricao;
        this.receita = receita;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNumeroVersao() {
        return numeroVersao;
    }

    public void setNumeroVersao(int numeroVersao) {
        this.numeroVersao = numeroVersao;
    }

    public LocalDate getDataVersao() {
        return dataVersao;
    }

    public void setDataVersao(LocalDate dataVersao) {
        this.dataVersao = dataVersao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getReceita() {
        return receita;
    }

    public void setReceita(String receita) {
        this.receita = receita;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
