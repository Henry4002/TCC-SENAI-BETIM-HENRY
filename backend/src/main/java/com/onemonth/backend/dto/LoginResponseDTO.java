package com.onemonth.backend.dto;

public class LoginResponseDTO {

    private String mensagem;
    private String nome;
    private String perfil;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(String mensagem, String nome, String perfil) {
        this.mensagem = mensagem;
        this.nome = nome;
        this.perfil = perfil;
    }

    public String getMensagem() {
        return mensagem;
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
