package com.onemonth.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EstoqueDTO {
    private Long id;
    private LocalDateTime dataAtualizacao;
    private int qtdMinima;
    private int quantidade;
    private LocalDate dataFabricacao;
    private LocalDate dataValidade;
    private String lote;
    private String statusValidade;
    private String produto;

    public EstoqueDTO() {
    }

    public EstoqueDTO(Long id, LocalDateTime dataAtualizacao, int qtdMinima, int quantidade, LocalDate dataFabricacao, LocalDate dataValidade, String lote, String statusValidade, String produto) {
        this.id = id;
        this.dataAtualizacao = dataAtualizacao;
        this.qtdMinima = qtdMinima;
        this.quantidade = quantidade;
        this.dataFabricacao = dataFabricacao;
        this.dataValidade = dataValidade;
        this.lote = lote;
        this.statusValidade = statusValidade;
        this.produto = produto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    public int getQtdMinima() {
        return qtdMinima;
    }

    public void setQtdMinima(int qtdMinima) {
        this.qtdMinima = qtdMinima;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public LocalDate getDataFabricacao() {
        return dataFabricacao;
    }

    public void setDataFabricacao(LocalDate dataFabricacao) {
        this.dataFabricacao = dataFabricacao;
    }

    public LocalDate getDataValidade() {
        return dataValidade;
    }

    public void setDataValidade(LocalDate dataValidade) {
        this.dataValidade = dataValidade;
    }

    public String getLote() {
        return lote;
    }

    public void setLote(String lote) {
        this.lote = lote;
    }

    public String getStatusValidade() {
        return statusValidade;
    }

    public void setStatusValidade(String statusValidade) {
        this.statusValidade = statusValidade;
    }

    public String getProduto() {
        return produto;
    }

    public void setProduto(String produto) {
        this.produto = produto;
    }
}
