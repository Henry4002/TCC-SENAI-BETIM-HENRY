package com.onemonth.backend.repository;

import com.onemonth.backend.model.Historico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface HistoricoRepository extends JpaRepository<Historico, Long> {

    @Query("""
            SELECT h FROM Historico h
            WHERE (:usuarioId IS NULL OR h.usuario.id = :usuarioId)
            AND (:produtoId IS NULL OR h.produto.id = :produtoId)
            AND (:busca IS NULL OR LOWER(h.acao) LIKE LOWER(CONCAT('%', :busca, '%')))
            AND (:dataInicio IS NULL OR h.dataHistorico >= :dataInicio)
            AND (:dataFim IS NULL OR h.dataHistorico <= :dataFim)
            ORDER BY h.dataHistorico DESC
            """,
            countQuery = """
            SELECT COUNT(h) FROM Historico h
            WHERE (:usuarioId IS NULL OR h.usuario.id = :usuarioId)
            AND (:produtoId IS NULL OR h.produto.id = :produtoId)
            AND (:busca IS NULL OR LOWER(h.acao) LIKE LOWER(CONCAT('%', :busca, '%')))
            AND (:dataInicio IS NULL OR h.dataHistorico >= :dataInicio)
            AND (:dataFim IS NULL OR h.dataHistorico <= :dataFim)
            """)
    Page<Historico> buscarComFiltros(
            @Param("usuarioId") Long usuarioId,
            @Param("produtoId") Long produtoId,
            @Param("busca") String busca,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim,
            Pageable pageable
    );
}