package com.onemonth.backend.repository;

import com.onemonth.backend.model.StatusProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface StatusProdutoRepository extends JpaRepository<StatusProduto, Long>{

}
