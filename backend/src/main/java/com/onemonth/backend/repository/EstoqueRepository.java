package com.onemonth.backend.repository;

import com.onemonth.backend.model.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Long> {
}
