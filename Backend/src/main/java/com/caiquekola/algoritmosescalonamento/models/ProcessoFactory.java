package com.caiquekola.algoritmosescalonamento.models;


public class ProcessoFactory {
    public static Processo criarProcesso(String tipo) {
        switch (tipo) {
            case "Fifo":
                return new Fifo();
            case "RoundRobin":
                return new RoundRobin();
            default:
                throw new IllegalArgumentException("Tipo desconhecido: " + tipo);
        }
    }
}