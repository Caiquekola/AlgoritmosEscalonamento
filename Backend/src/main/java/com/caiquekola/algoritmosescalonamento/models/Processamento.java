package com.caiquekola.algoritmosescalonamento.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import com.caiquekola.algoritmosescalonamento.models.Processo;


@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Processamento{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //inteiro será a posição de chegada e
    @OneToMany
    @JoinColumn(name = "processo_id")
    private List<Processo> processos;
    private String algoritmo;
    private int quantum;
    private int tempoExecucao;
    private int quantidadeProcessos;
    private int tempoEspera;
    private int trocasContexto;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public List<Processo> getProcessos() {
        return processos;
    }

    public void setProcessos(List<Processo> processos) {
        this.processos = processos;
    }

    public String getAlgoritmo() {
        return algoritmo;
    }

    public void setAlgoritmo(String algoritmo) {
        this.algoritmo = algoritmo;
    }

    public int getQuantum() {
        return quantum;
    }

    public void setQuantum(int quantum) {
        this.quantum = quantum;
    }

    public int getTempoExecucao() {
        return tempoExecucao;
    }

    public void setTempoExecucao(int tempoExecucao) {
        this.tempoExecucao = tempoExecucao;
    }

    public int getQuantidadeProcessos() {
        return quantidadeProcessos;
    }

    public void setQuantidadeProcessos(int quantidadeProcessos) {
        this.quantidadeProcessos = quantidadeProcessos;
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
        return "Processamento{" +
                "id=" + id +
                ", processos=" + processos +
                ", algoritmo='" + algoritmo + '\'' +
                ", quantum=" + quantum +
                ", tempoExecucao=" + tempoExecucao +
                ", quantidadeProcessos=" + quantidadeProcessos +
                ", tempoEspera=" + tempoEspera +
                ", trocasContexto=" + trocasContexto +
                '}';
    }
}
