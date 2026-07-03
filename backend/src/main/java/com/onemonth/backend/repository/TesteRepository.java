package com.onemonth.backend.repository;

import com.onemonth.backend.model.Teste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TesteRepository extends JpaRepository<Teste, Long> {
}
