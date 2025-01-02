package com.caiquekola.algoritmosescalonamento.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Processamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;

    public int tempo_medio;
    public int tempo_espera;
    public int duracao;
    public int trocas_contexto;
}
