package com.caiquekola.algoritmosescalonamento.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/scheduler")
public class SchedulerController {

    @PostMapping("/run")
    public ResponseEntity<String> runScheduler(@RequestBody SchedulerRequest request) {
        // Lógica para processar os dados recebidos e executar o algoritmo
        System.out.println("Algoritmo: " + request.getAlgoritmo());
        System.out.println("Quantum: " + request.getQuantum());
        System.out.println("Processos: " + request.getProcessos());

        // Retorne o resultado da execução
        return ResponseEntity.ok("Algoritmo executado com sucesso!");
    }
}

class SchedulerRequest {
    private String algoritmo;
    private int quantum;
    private List<Process> processos;

    // Getters e setters


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

    public List<Process> getProcessos() {
        return processos;
    }

    public void setProcessos(List<Process> processos) {
        this.processos = processos;
    }

    public static class Process {
        private String arrivalTime;
        private String executionTime;
        private String priority;

        // Getters e setters

        public String getArrivalTime() {
            return arrivalTime;
        }

        public void setArrivalTime(String arrivalTime) {
            this.arrivalTime = arrivalTime;
        }

        public String getExecutionTime() {
            return executionTime;
        }

        public void setExecutionTime(String executionTime) {
            this.executionTime = executionTime;
        }

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }

        @Override
        public String toString() {
            return "Process{" +
                    "arrivalTime='" + arrivalTime + '\'' +
                    ", executionTime='" + executionTime + '\'' +
                    ", priority='" + priority + '\'' +
                    '}';
        }
    }
}
