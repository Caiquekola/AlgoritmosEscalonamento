package com.caiquekola.algoritmosescalonamento.repositories;

import com.caiquekola.algoritmosescalonamento.models.RoundRobin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoundRobinRepository extends JpaRepository<RoundRobin, Integer> {

}
