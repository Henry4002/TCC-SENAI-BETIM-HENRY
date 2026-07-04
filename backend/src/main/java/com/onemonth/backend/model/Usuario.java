package com.onemonth.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "usuario")
public class Usuario {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório!")
    @Size(min =3, max = 100, message = "O nome deve possuir entre 3 e 100 caracteres!")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "A senha é obrigatória!")
    @Size(min =6, message = "A senha deve possuir no mínimo 6 caracteres!")
    @Column(nullable = false)
    private String senha;

    @NotBlank(message = "O e-mail é obrigatório!")
    @Email(message = "Informe um e-mail válido!")
    @Column(nullable = false, unique = true)
    private String email;

    @NotNull(message = "Perfil é obrigatório!")
    @ManyToOne
    @JoinColumn(name = "idPerfil")
    private Perfil perfil;

    public Usuario() {
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Perfil getPerfil() {
        return perfil;
    }

    public void setPerfil(Perfil perfil) {
        this.perfil = perfil;
    }
}
