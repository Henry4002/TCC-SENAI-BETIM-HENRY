package com.onemonth.backend.dto;

import java.time.LocalDateTime;

public class HistoricoDTO {
    private Long id;
    private String acao;
    private LocalDateTime dataHistorico;
    private String usuario;
    private String produto;

    public HistoricoDTO() {
    }

    public HistoricoDTO(Long id, String acao, LocalDateTime dataHistorico, String usuario, String produto) {
        this.id = id;
        this.acao = acao;
        this.dataHistorico = dataHistorico;
        this.usuario = usuario;
        this.produto = produto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAcao() {
        return acao;
    }

    public void setAcao(String acao) {
        this.acao = acao;
    }

    public LocalDateTime getDataHistorico() {
        return dataHistorico;
    }

    public void setDataHistorico(LocalDateTime dataHistorico) {
        this.dataHistorico = dataHistorico;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getProduto() {
        return produto;
    }

    public void setProduto(String produto) {
        this.produto = produto;
    }
}
