package com.caiquekola.algoritmosescalonamento.models;


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type" // Define o campo que será usado para distinguir as subclasses
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = RoundRobin.class, name = "RoundRobin"),
        @JsonSubTypes.Type(value = Fifo.class, name = "RoundRobin"),

})
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public abstract class Processo {
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

