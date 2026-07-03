package com.onemonth.backend.repository;

import com.onemonth.backend.model.VersaoReceita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface VersaoReceitaRepository extends JpaRepository<VersaoReceita, Long> {
}
