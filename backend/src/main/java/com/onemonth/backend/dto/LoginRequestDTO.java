package com.onemonth.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {

    @NotBlank(message = "E-mail é obrigatório!")
    @Email(message = "E-mail inválido!")
    private String email;

    @NotBlank(message = "Senha é obrigatória!")

    private String senha;

    public LoginRequestDTO() {
    }

    public LoginRequestDTO(String email, String senha) {
        this.email = email;
        this.senha = senha;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
