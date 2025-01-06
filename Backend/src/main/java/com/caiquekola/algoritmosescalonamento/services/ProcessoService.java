package com.caiquekola.algoritmosescalonamento.services;

import com.caiquekola.algoritmosescalonamento.models.Fifo;
import com.caiquekola.algoritmosescalonamento.models.Processo;
import com.caiquekola.algoritmosescalonamento.factories.ProcessoFactory;
import com.caiquekola.algoritmosescalonamento.models.RoundRobin;
import com.caiquekola.algoritmosescalonamento.repositories.ProcessoRepository;
import com.caiquekola.algoritmosescalonamento.services.exceptions.DataBindingViolationException;
import com.caiquekola.algoritmosescalonamento.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ProcessoService {
    //CRUD
    //GET POST UPDATE DELETE
    @Autowired
    private ProcessoRepository processoRepository;

    //GET
    public Processo encontrarPeloId(Integer id){
        Optional<Processo> processo = processoRepository.findById(id);
        return processo.orElseThrow(()-> new ObjectNotFoundException("Objeto não encontrado"));
    }
    //POST
    //arquitetura para atomicidade
    @Transactional
    public Processo criar(Processo processo, String tipo) {
        System.out.println(processo + tipo);
        Processo novoProcesso = ProcessoFactory.criarProcesso(tipo);
        novoProcesso.setTempoExecucao(processo.getTempoExecucao());
        novoProcesso.setTempoChegada(processo.getTempoChegada());
        novoProcesso.setTempoEspera(processo.getTempoEspera());
        novoProcesso.setTrocasContexto(processo.getTrocasContexto());

//        if (novoProcesso instanceof Fifo && processo instanceof Fifo) {
//            ((Fifo) novoProcesso).setPrioridade(((Fifo) processo).getPrioridade());
//        } else
        if (novoProcesso instanceof RoundRobin && processo instanceof RoundRobin) {
            ((RoundRobin) novoProcesso).setQuantum(((RoundRobin) processo).getQuantum());
        }

        return processoRepository.save(novoProcesso);
    }

    //UPDATE
    @Transactional
    public Processo atualizar(Processo processo,String tipo){
        //Reutilização do código find by id
        Processo novoProcesso = ProcessoFactory.criarProcesso(tipo);
        novoProcesso.setTempoChegada((processo.getTempoChegada()));
        novoProcesso.setTempoExecucao(processo.getTempoExecucao());
        novoProcesso.setTempoEspera(processo.getTempoEspera());
        novoProcesso.setTrocasContexto(processo.getTrocasContexto());

        if (novoProcesso instanceof RoundRobin && processo instanceof RoundRobin) {
            ((RoundRobin) novoProcesso).setQuantum(((RoundRobin) processo).getQuantum());
        }
//        else if (novoProcesso instanceof Fifo && processo instanceof Fifo) {
//            ((Fifo) novoProcesso).setPrioridade(((Fifo) processo).getPrioridade());
//        }

        return this.processoRepository.save(novoProcesso);
    }

    //DELETE
    public void deletar(Integer id){
        Processo processo = encontrarPeloId(id);
        try{
            this.processoRepository.delete(processo);
        }catch (Exception e){
            throw new DataBindingViolationException(e+" Erro na delecao do processo");
        }
    }

}
