package com.onemonth.backend.dto;

public class UsuarioDTO {

    private Long id;
    private String nome;
    private String email;
    private String perfil;
    private String atualizadoEm;

    public UsuarioDTO() {
    }

    public UsuarioDTO(Long id, String nome, String email, String perfil, String atualizadoEm) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.perfil = perfil;
        this.atualizadoEm = atualizadoEm;
    }

    public String getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(String atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }
}


