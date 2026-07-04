package com.onemonth.backend.repository;

import com.onemonth.backend.model.StatusVersaoReceita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface StatusVersaoReceitaRepository extends JpaRepository <StatusVersaoReceita, Long> {
}
