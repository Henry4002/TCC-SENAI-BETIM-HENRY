package com.onemonth.backend.repository;

import com.onemonth.backend.model.VersaoReceita;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VersaoReceitaRepository extends JpaRepository<VersaoReceita, Long> {
}
