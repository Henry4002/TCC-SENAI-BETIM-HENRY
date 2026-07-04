package com.onemonth.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.cglib.core.Local;

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

    @NotNull(message = "A data de fabricação é obrigatória!")
    @PastOrPresent(message = "A data de fabricação não pode ser futura!")
    private LocalDate dataFabricacao;

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

    @PrePersist
    @PreUpdate
    public void atualizarDataAtualizacao(){
        this.dataAtualizacao = LocalDateTime.now();
    }

    public enum StatusValidade{
        NORMAL,
        PERTO_DE_VENCER,
        VENCIDO
    }

    public Estoque() {
    }

    public StatusValidade getStatusValidade(){

        LocalDate hoje = LocalDate.now();

        if(dataValidade.isBefore(hoje)){
            return StatusValidade.VENCIDO;
        }
        if(dataValidade.isBefore(hoje.plusDays(7))){
            return StatusValidade.PERTO_DE_VENCER;
        }

        return StatusValidade.NORMAL;

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

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }
}
