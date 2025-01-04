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
    private List<Processo> fifos;
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

    public List<Processo> getFifos() {
        return fifos;
    }

    public void setFifos(List<Processo> fifos) {
        this.fifos = fifos;
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
}
