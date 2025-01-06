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
        @JsonSubTypes.Type(value = Fifo.class, name = "fifo"),
        @JsonSubTypes.Type(value = RoundRobin.class, name = "roundrobin")
})
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Processo implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private int tempoChegada;
    private int tempoExecucao;
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

    public int getTempoExecucao() {
        return tempoExecucao;
    }

    public void setTempoExecucao(int tempoProcessamento) {
        this.tempoExecucao = tempoProcessamento;
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
                ", tempoProcessamento=" + tempoExecucao +
                ", tempoChegada=" + tempoChegada +
                ", tempoEspera=" + tempoEspera +
                ", trocasContexto=" + trocasContexto +
                '}';
    }
}

