package com.onemonth.backend.repository;

import com.onemonth.backend.model.Historico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface HistoricoRepository extends JpaRepository <Historico, Long> {
}
