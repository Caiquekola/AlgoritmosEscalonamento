package com.caiquekola.algoritmosescalonamento.factories;

import com.caiquekola.algoritmosescalonamento.models.Fifo;
import com.caiquekola.algoritmosescalonamento.models.Processo;
import com.caiquekola.algoritmosescalonamento.models.RoundRobin;

import java.util.HashMap;
import java.util.Map;

public class ProcessoFactory {
    // Mapa para registrar as classes dos tipos de processo
    private static final Map<String, Class<? extends Processo>> registro = new HashMap<>();

    // Registro inicial (pode ser expandido dinamicamente)
    static {
        registrar("FIFO", Fifo.class);        // Adicionei em maiúsculas para consistência
        registrar("ROUNDROBIN", RoundRobin.class);
    }

    // Métudo para registrar novos tipos de processos
    public static void registrar(String tipo, Class<? extends Processo> classe) {
        registro.put(tipo, classe);
    }

    // Métudo para criar um processo com base no tipo
    public static Processo criarProcesso(String tipo) {
        tipo = tipo.toUpperCase(); // Garantir que o tipo seja em maiúsculas

        // Debug para verificar as chaves e valores do registro
        System.out.println("Buscando tipo: " + tipo);
        for (Map.Entry<String, Class<? extends Processo>> entrada : registro.entrySet()) {
            System.out.println("key = " + entrada.getKey() + ", value = " + entrada.getValue());
        }

        // Verificar se a classe existe no mapa
        Class<? extends Processo> classe = registro.get(tipo);
        if (classe == null) {
            throw new IllegalArgumentException("Tipo desconhecido: " + tipo);
        }

        try {
            // Instanciação do processo usando reflexão
            return classe.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criar o processo do tipo: " + tipo, e);
        }
    }
}
