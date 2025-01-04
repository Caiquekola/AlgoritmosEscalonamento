package com.caiquekola.algoritmosescalonamento.repositories;

import com.caiquekola.algoritmosescalonamento.models.Processamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessamentoRepository extends JpaRepository<Processamento, Integer> {
}
