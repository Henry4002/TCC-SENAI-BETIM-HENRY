package com.onemonth.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "teste")
public class Teste {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_teste", nullable = false)
    private LocalDateTime dataTeste;

    @NotBlank(message = "O resultado é obrigatório!")
    @Column(columnDefinition = "TEXT")
    private String resultado;

    @NotNull(message = "O usuário é obrigatório!")
    @ManyToOne
    @JoinColumn(name = "idUsuario")
    private Usuario usuario;

    @NotNull(message = "A versão-receita é obrigatória!")
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
