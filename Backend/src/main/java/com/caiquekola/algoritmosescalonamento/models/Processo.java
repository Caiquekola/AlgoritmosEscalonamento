package com.caiquekola.algoritmosescalonamento.models;


import jakarta.persistence.*;

import java.io.Serializable;

@MappedSuperclass
public abstract class Processo implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private int tempoProcessamento;
    private int tempoChegada;
    private int tempoEspera;
    private int trocasContexto;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getTempoProcessamento() {
        return tempoProcessamento;
    }

    public void setTempoProcessamento(int tempoProcessamento) {
        this.tempoProcessamento = tempoProcessamento;
    }

    public int getTempoChegada() {
        return tempoChegada;
    }

    public void setTempoChegada(int tempoChegada) {
        this.tempoChegada = tempoChegada;
    }

    public int getTempoEspera() {
        return tempoEspera;
    }

    public void setTempoEspera(int tempoEspera) {
        this.tempoEspera = tempoEspera;
    }

    public int getTrocasContexto() {
        return trocasContexto;
    }

    public void setTrocasContexto(int trocasContexto) {
        this.trocasContexto = trocasContexto;
    }
}

