package com.onemonth.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "estoque")
public class Estoque {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "data_atualizacao", nullable = false)
    private LocalDateTime dataAtualizacao;

    @NotNull(message = "Quantidade mínima é obrigatório!")
    @PositiveOrZero(message = "A quantidade não pode ser negativa!")
    @Column(name = "qtd_minima", nullable = false)
    private int qtdMinima;

    @NotNull(message = "Quantidade é obrigatória!")
    @PositiveOrZero(message = "A quantidade não pode ser negativa!")
    @Column(name = "quantidade", nullable = false)
    private int quantidade;

    @NotNull(message = "A data de validade é obrigatória!")
    @Future(message = "A data de validade deve ser uma data futura!")
    @Column(name = "data_validade", nullable = false)
    private LocalDate dataValidade;

    @NotBlank(message = "Lote é obrigatório!")
    @Column(name = "lote", nullable = false)
    private String lote;

    @NotNull(message = "O produto é obrigatório!")
    @OneToOne
    @JoinColumn(name = "idProduto")
    private Produto produto;

    public Estoque() {
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

    public void setDataAtualizacao(LocalDateTime dataAtualzacao) {
        this.dataAtualizacao = dataAtualzacao;
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

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }
}
