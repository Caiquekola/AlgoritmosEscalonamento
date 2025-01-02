package com.caiquekola.algoritmosescalonamento.repositories;

import com.caiquekola.algoritmosescalonamento.models.Fifo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FifoRepository extends JpaRepository<Fifo, Integer> {

}
