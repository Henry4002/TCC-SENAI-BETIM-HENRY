    package com.onemonth.backend.model;


    import jakarta.persistence.*;
    import jakarta.validation.constraints.NotBlank;
    import jakarta.validation.constraints.NotNull;

    import java.time.LocalDateTime;

    @Entity
    @Table(name = "historico")
    public class Historico {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @NotBlank(message = "A ação é obrigatória!")
        @Column(columnDefinition = "TEXT")
        private String acao;


        @Column(name = "data_historico")
        private LocalDateTime dataHistorico;

        @NotNull(message = "O usuário é obrigatório!")
        @ManyToOne
        @JoinColumn(name = "idUsuario")
        private Usuario usuario;

        @NotNull(message = "O produto é obrigatório!")
        @ManyToOne
        @JoinColumn(name = "idProduto")
        private Produto produto;

        public Historico() {
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

        public Usuario getUsuario() {
            return usuario;
        }

        public void setUsuario(Usuario usuario) {
            this.usuario = usuario;
        }

        public Produto getProduto() {
            return produto;
        }

        public void setProduto(Produto produto) {
            this.produto = produto;
        }
    }
