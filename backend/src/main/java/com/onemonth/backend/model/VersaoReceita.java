package com.onemonth.backend.model;


import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "versao_receita")
public class VersaoReceita {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_versao", nullable = false)
    private int numero_versao;

    @Column(name = "data_versao", nullable = false)
    private LocalDate data_versao;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "idReceita")
    private Receita receita;

    public VersaoReceita() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNumero_versao() {
        return numero_versao;
    }

    public void setNumero_versao(int numero_versao) {
        this.numero_versao = numero_versao;
    }

    public LocalDate getData_versao() {
        return data_versao;
    }

    public void setData_versao(LocalDate data_versao) {
        this.data_versao = data_versao;
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


}
