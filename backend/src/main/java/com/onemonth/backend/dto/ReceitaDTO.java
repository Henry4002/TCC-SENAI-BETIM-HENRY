package com.onemonth.backend.dto;

public class ReceitaDTO {
    private Long id;
    private String nome;
    private String produto;

    public ReceitaDTO() {
    }

    public ReceitaDTO(Long id, String nome, String produto) {
        this.id = id;
        this.nome = nome;
        this.produto = produto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getProduto() {
        return produto;
    }

    public void setProduto(String produto) {
        this.produto = produto;
    }
}
