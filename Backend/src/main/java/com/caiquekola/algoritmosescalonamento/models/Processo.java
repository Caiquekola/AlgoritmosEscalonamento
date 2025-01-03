package com.caiquekola.algoritmosescalonamento.models;


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;

import java.io.Serializable;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "tipo"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Fifo.class, name = "Fifo"),
        @JsonSubTypes.Type(value = RoundRobin.class, name = "RoundRobin"),
        @JsonSubTypes.Type(value = Processamento.class, name = "Processamento")
})
@MappedSuperclass
public abstract class Processo implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private int tempoProcessamento;
    private int tempoChegada;
    @Column(nullable = true)
    private int tempoEspera;
    @Column(nullable = true)
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

    @Override
    public String toString() {
        return "Processo{" +
                "id=" + id +
                ", tempoProcessamento=" + tempoProcessamento +
                ", tempoChegada=" + tempoChegada +
                ", tempoEspera=" + tempoEspera +
                ", trocasContexto=" + trocasContexto +
                '}';
    }
}

