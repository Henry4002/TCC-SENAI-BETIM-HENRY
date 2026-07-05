package com.onemonth.backend.dto;

public class LoginResponseDTO {

    private Long id;
    private String mensagem;
    private String nome;
    private String perfil;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(Long id,String mensagem, String nome, String perfil) {
        this.id = id;
        this.mensagem = mensagem;
        this.nome = nome;
        this.perfil = perfil;
    }

    public String getMensagem() {
        return mensagem;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }
}
