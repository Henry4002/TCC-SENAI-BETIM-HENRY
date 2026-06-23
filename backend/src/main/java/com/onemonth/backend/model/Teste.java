package com.onemonth.backend.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "teste")
public class Teste {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_teste", nullable = false)
    private LocalDateTime data_teste;

    @Column(columnDefinition = "TEXT")
    private String resultado;

    @ManyToOne
    @JoinColumn(name = "idUsuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "idVersao_receita")
    private VersaoReceita versaoReceita;

    public Teste() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getData_teste() {
        return data_teste;
    }

    public void setData_teste(LocalDateTime data_teste) {
        this.data_teste = data_teste;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public VersaoReceita getVersaoReceita() {
        return versaoReceita;
    }

    public void setVersaoReceita(VersaoReceita versaoReceita) {
        this.versaoReceita = versaoReceita;
    }
}
