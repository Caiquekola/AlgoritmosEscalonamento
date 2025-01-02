package com.caiquekola.algoritmosescalonamento.repositories;

import com.caiquekola.algoritmosescalonamento.models.Processo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessoRepository extends JpaRepository<Processo, Integer> {

}
