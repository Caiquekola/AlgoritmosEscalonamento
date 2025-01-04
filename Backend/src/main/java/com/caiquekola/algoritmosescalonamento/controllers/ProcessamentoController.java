package com.caiquekola.algoritmosescalonamento.controllers;

import com.caiquekola.algoritmosescalonamento.models.Processamento;
import com.caiquekola.algoritmosescalonamento.models.Processo;
import com.caiquekola.algoritmosescalonamento.services.ProcessamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/processamento")
public class ProcessamentoController{

    @Autowired
    private ProcessamentoService processamentoService;

    @GetMapping("/{id}")
    public ResponseEntity<Processamento> getProcessamento(@PathVariable Integer id){
        Processamento processamento = processamentoService.encontrarPeloId(id);
        return ResponseEntity.ok().body(processamento);
    }

    @PostMapping
    public ResponseEntity<Void> createProcessamento(@RequestBody Processamento processamento){
        processamento.setId(null);
        processamentoService.criarProcessamento(processamento);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(processamento.getId())
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateProcessamento(@PathVariable Integer id, @RequestBody Processamento processamento){
        processamento.setId(id);
        processamentoService.criarProcessamento(processamento);
        return ResponseEntity.noContent().build();
    }

}
