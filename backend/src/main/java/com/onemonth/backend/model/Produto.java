package com.onemonth.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório!")
    @Size(max = 100, message = "O nome deve possuir no máximo 100 caracteres!")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "Descrição é obrigatória!")
    @Size(max = 500, message = "A descrição deve possuir no máximo 500 caracteres!")
    @Column(nullable = false)
    private String descricao;

    @NotBlank(message = "Categoria é obrigatória!")
    @Column(nullable = false)
    private String categoria;

    @NotNull(message = "Usuário é obrigatório!")
    @ManyToOne
    @JoinColumn(name = "idUsuario")
    private Usuario usuario;



    public Produto() {
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}
