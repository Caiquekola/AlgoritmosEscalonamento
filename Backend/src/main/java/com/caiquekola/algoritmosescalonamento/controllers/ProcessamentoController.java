package com.caiquekola.algoritmosescalonamento.controllers;

import com.caiquekola.algoritmosescalonamento.factories.ProcessoFactory;
import com.caiquekola.algoritmosescalonamento.models.Processamento;
import com.caiquekola.algoritmosescalonamento.models.Processo;
import com.caiquekola.algoritmosescalonamento.services.ProcessamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/processamento")
public class ProcessamentoController{

    @Autowired
    private ProcessamentoService processamentoService;

    @PostMapping("/rodar")
    public ResponseEntity<String> rodar(@RequestBody Processamento processamento, @RequestParam("tipo") String tipo) {
        System.out.println(processamento);
        // Lógica para processar os dados recebidos e executar o algoritmo
        System.out.println("Algoritmo: " + processamento.getAlgoritmo());
        System.out.println("Quantum: " + processamento.getQuantum());
        System.out.println("Processos: " + processamento.getProcessos());
//        Processo processo = ProcessoFactory.criarProcesso(request.getAlgoritmo());
        switch (tipo.toLowerCase()){
            case "fifo":
                System.out.println("Algoritmo Fifo executado com sucesso");
                break;
        }
        // Retorne o resultado da execução
        return ResponseEntity.ok("Algoritmo executado com sucesso!");
    }
//    private String algoritmo;
//    private int quantum;
//    private List<SchedulerRequest.Process> processos;
}
