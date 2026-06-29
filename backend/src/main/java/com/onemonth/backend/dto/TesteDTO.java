package com.onemonth.backend.dto;

import java.time.LocalDateTime;

public class TesteDTO {
    private Long id;
    private LocalDateTime dataTeste;
    private String resultado;
    private String usuario;
    private String receita;
    private int numeroVersao;

    public TesteDTO() {
    }

    public TesteDTO(Long id, LocalDateTime dataTeste, String resultado, String usuario, String receita, int numeroVersao) {
        this.id = id;
        this.dataTeste = dataTeste;
        this.resultado = resultado;
        this.usuario = usuario;
        this.receita = receita;
        this.numeroVersao = numeroVersao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataTeste() {
        return dataTeste;
    }

    public void setDataTeste(LocalDateTime dataTeste) {
        this.dataTeste = dataTeste;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getReceita() {
        return receita;
    }

    public void setReceita(String receita) {
        this.receita = receita;
    }

    public int getNumeroVersao() {
        return numeroVersao;
    }

    public void setNumeroVersao(int numeroVersao) {
        this.numeroVersao = numeroVersao;
    }
}
