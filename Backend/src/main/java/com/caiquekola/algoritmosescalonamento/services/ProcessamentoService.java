package com.caiquekola.algoritmosescalonamento.services;

import com.caiquekola.algoritmosescalonamento.models.Processamento;
import com.caiquekola.algoritmosescalonamento.models.Processo;
import com.caiquekola.algoritmosescalonamento.repositories.ProcessamentoRepository;
import com.caiquekola.algoritmosescalonamento.repositories.ProcessoRepository;
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

    @Autowired
    private ProcessoRepository processoRepository;

    @org.springframework.transaction.annotation.Transactional
    public Processamento salvarProcessamento(Processamento processamento) {

        processamento = processamentoRepository.save(processamento);

        System.out.println("Processamento salvo com id: "+processamento.getId());

        // Salvar os processos individualmente
        List<Processo> processos = processamento.getProcessos();
        if (processos != null) {
            for (Processo processo : processos) {
                processo.setProcessamento(processamento); // Vincula o processamento ao processo
                processoRepository.save(processo);

            }
        }


        // Salvar o processamento
        return processamento;
    }


    //Read
    public Processamento encontrarPeloId(Integer idProcesso) {
        Optional<Processamento> processamento = processamentoRepository.findById(idProcesso);
        return processamento.orElseThrow(()->new ObjectNotFoundException("Objeto não encontrado"));
    }

    //create


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
