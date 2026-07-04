package com.onemonth.backend.dto;

import java.time.LocalDateTime;

public class EstoqueDTO {
    private Long id;
    private LocalDateTime dataAtualizacao;
    private int qtdMinima;
    private int quantidade;
    private String lote;
    private String produto;

    public EstoqueDTO() {
    }

    public EstoqueDTO(Long id, LocalDateTime dataAtualizacao, int qtdMinima, int quantidade, String lote, String produto) {
        this.id = id;
        this.dataAtualizacao = dataAtualizacao;
        this.qtdMinima = qtdMinima;
        this.quantidade = quantidade;
        this.lote = lote;
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

    public String getLote() {
        return lote;
    }

    public void setLote(String lote) {
        this.lote = lote;
    }

    public String getProduto() {
        return produto;
    }

    public void setProduto(String produto) {
        this.produto = produto;
    }
}
