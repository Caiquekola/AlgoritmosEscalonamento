package com.caiquekola.algoritmosescalonamento.controllers;

import com.caiquekola.algoritmosescalonamento.models.Processo;
import com.caiquekola.algoritmosescalonamento.models.ProcessoFactory;
import com.caiquekola.algoritmosescalonamento.services.ProcessoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;


@RestController
@RequestMapping("/processo")
public class ProcessoController {
    @Autowired
    private ProcessoService processoService;

    @GetMapping
    public ResponseEntity initPage(){
        return ResponseEntity.ok("Okay!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Processo> findById(@PathVariable Integer id){
        Processo processo = processoService.encontrarPeloId(id);
        return ResponseEntity.ok().body(processo);
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody Processo processo, @RequestParam String tipo) {
        try {
            Processo novoProcesso = processoService.criar(processo, tipo);
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(novoProcesso.getId())
                    .toUri();
            return ResponseEntity.created(uri).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@RequestParam String tipo,
                                       @RequestBody Processo processo,
                                       @PathVariable Integer id){
        processo.setId(id);
        this.processoService.atualizar(processo,tipo);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        this.processoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
