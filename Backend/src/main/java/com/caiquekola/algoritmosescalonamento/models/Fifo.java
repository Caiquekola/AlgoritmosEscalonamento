package com.caiquekola.algoritmosescalonamento.models;


import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;


@Entity
public class Fifo extends Processo{

    private int prioridade;

    public int getPrioridade() {
        return prioridade;
    }

    public void setPrioridade(int prioridade) {
        this.prioridade = prioridade;
    }
}
