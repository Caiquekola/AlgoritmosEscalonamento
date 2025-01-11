package com.caiquekola.algoritmosescalonamento.controllers;

import com.caiquekola.algoritmosescalonamento.models.Processamento;
import com.caiquekola.algoritmosescalonamento.services.ProcessamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/processamento")
public class ProcessamentoController{

    @Autowired
    private ProcessamentoService processamentoService;

    @PostMapping("/rodar")
    public ResponseEntity<String> rodar(@RequestBody Processamento processamento, @RequestParam("tipo") String tipo) {

        processamento.setQuantidadeProcessos(processamento.getProcessos().size());
        System.out.println(processamento);
        // Lógica para processar os dados recebidos e executar o algoritmo
        System.out.println("Algoritmo Processamento: " + processamento.getAlgoritmo());
        System.out.println("Algoritmo Parâmetro: " + tipo);
        System.out.println("Quantum: " + processamento.getQuantum());
        System.out.println("Quantidade de processos: "+processamento.getProcessos().size());
        System.out.println("Processos: " + processamento.getProcessos());
//        Processo processo = ProcessoFactory.criarProcesso(request.getAlgoritmo());
        switch (tipo.toLowerCase()){
            case "sjf":
                System.out.println("Algoritmo Fifo executado com sucesso");
                break;
                case "roundrobin":
                    System.out.println("Algoritmo roundrobin executado com sucesso");
                    break;
        }
        processamentoService.salvarProcessamento(processamento);

        // Retorne o resultado da execução
        return ResponseEntity.ok("Algoritmo "+ tipo +" salvo com sucesso");
    }
//    private String algoritmo;
//    private int quantum;
//    private List<SchedulerRequest.Process> processos;
}
