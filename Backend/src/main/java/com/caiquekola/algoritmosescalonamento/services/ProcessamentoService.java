package com.caiquekola.algoritmosescalonamento.services;

import com.caiquekola.algoritmosescalonamento.models.Processamento;
import com.caiquekola.algoritmosescalonamento.models.Processo;
import com.caiquekola.algoritmosescalonamento.repositories.ProcessamentoRepository;
import com.caiquekola.algoritmosescalonamento.services.exceptions.DataBindingViolationException;
import com.caiquekola.algoritmosescalonamento.services.exceptions.ObjectNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProcessamentoService {
    @Autowired
    private ProcessamentoRepository processamentoRepository;

    //Read
    public Processamento encontrarPeloId(Integer idProcesso) {
        Optional<Processamento> processamento = processamentoRepository.findById(idProcesso);
        return processamento.orElseThrow(()->new ObjectNotFoundException("Objeto não encontrado"));
    }

    //create
    @Transactional
    public Processamento criarProcessamento(Processamento processamento) {
        processamento.setId(null);
        return processamentoRepository.save(processamento);
    }

//    public List<Processo> processoList(Processamento processamento){
//
//    }

    //update
    @Transactional
    public void atualizarProcessamento(Processamento processamento) {
        processamentoRepository.save(processamento);
    }

    //delete
    public void deleteProcessamento(Integer idProcessamento) {
        Processamento processamento = encontrarPeloId(idProcessamento);
        try{
            processamentoRepository.delete(processamento);
        } catch (Exception e) {
            throw new DataBindingViolationException(e.getMessage());
        }
    }
}
