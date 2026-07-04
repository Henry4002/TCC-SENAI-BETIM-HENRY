package com.onemonth.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;


@Entity
@Table(name = "versao_receita")
public class VersaoReceita {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Positive(message = "O número da versão deve ser maior que zero!")
    @Column(name = "numero_versao", nullable = false)
    private int numeroVersao;

    @Column(name = "data_versao", nullable = false)
    private LocalDate dataVersao;

    @NotBlank(message = "A descrição é obrigatória!")
    @Column(columnDefinition = "TEXT")
    private String descricao;

    @NotNull(message = "A receita é obrigatória!")
    @ManyToOne
    @JoinColumn(name = "idReceita")
    private Receita receita;

    @NotNull(message = "O status é obrigatório!")
    @ManyToOne
    @JoinColumn(name = "idStatus")
    private StatusVersaoReceita statusVersaoReceita;

    public VersaoReceita() {
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

    public Receita getReceita() {
        return receita;
    }

    public void setReceita(Receita receita) {
        this.receita = receita;
    }

    public StatusVersaoReceita getStatusVersaoReceita() {
        return statusVersaoReceita;
    }

    public void setStatusVersaoReceita(StatusVersaoReceita statusVersaoReceita) {
        this.statusVersaoReceita = statusVersaoReceita;
    }
}
