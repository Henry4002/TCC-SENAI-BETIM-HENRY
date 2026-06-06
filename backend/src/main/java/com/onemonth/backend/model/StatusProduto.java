package com.onemonth.backend.model;


import jakarta.persistence.*;

@Entity
@Table(name = "status_produto")
public class StatusProduto {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    public StatusProduto() {
    }

    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id = id;
    }

    public String getNome(){
        return nome;
    }
    public void setNome(String nome){
        this.nome = nome;
    }

}
