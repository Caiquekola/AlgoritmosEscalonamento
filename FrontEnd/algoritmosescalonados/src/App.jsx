import React, { useState } from "react";
import AlgorithmSelector from "./components/AlgorithmSelector";
import ProcessRow from "./components/ProcessRow";
import axios from "axios";
import ProcessVisualization from "./components/ProcessVisualization";
import ResultsDisplay from "./components/ResultDisplay";
import "./App.css";
import './index.css'


const App = () => {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState("sjf");
  const [quantum, setQuantum] = useState(2);
  const [results, setResults] = useState(null);
  const [nextProcessId, setNextProcessId] = useState(1);


  var processo = 1;

  const addProcess = () => {
    const newProcess = {
      id: "P" + nextProcessId,
      tempoChegada: "",
      tempoExecucao: "",
      prioridade: "",
    };
    setProcesses([...processes, newProcess]);
    setNextProcessId(nextProcessId + 1);
  };


  const removeProcess = (id) => {
    setProcesses(processes.filter((process) => process.id !== id));
  };

  const handleAlgorithmChange = (newAlgorithm) => {
    if (newAlgorithm !== algorithm) {
      setAlgorithm(newAlgorithm);
      setProcesses([]); // Limpa todos os processos
      setQuantum(2);

    }
  };



  const handleRun = async () => {
    const algoritmo = algorithm;

    try {
      const validProcesses = processes.filter(
        ({ tempoChegada, tempoExecucao, prioridade }) =>
          parseInt(tempoChegada, 10) > 0 ||
          parseInt(tempoExecucao, 10) > 0 ||
          parseInt(prioridade, 10) > 0
      );



      const payload = {
        algoritmo,
        quantum: parseInt(quantum, 10),
        processos: validProcesses.map(({ id, ...rest }) => ({
          ...rest,
          tipo: algorithm === "sjf" ? "sjf" : "roundrobin",
        })),
      };

      // Envie para o backend apenas os dados dos processos
      const response = await axios.post(
        `http://localhost:8080/processamento/rodar?tipo=${algorithm}`,
        payload
      );

      console.log("Resposta do backend:", response.data); // Aqui você ainda verá a resposta do backend confirmando que o processamento foi salvo

      // Agora calculamos as métricas no frontend
      var metrics;
      if (algorithm === "sjf") {
        metrics = calculateMetricsSJF(validProcesses);
      } else {
        metrics = calculateMetricsRR(validProcesses, quantum);
      }

      // Adicionando o console.log para ver os dados antes de enviar para o ProcessVisualization
      console.log("Dados enviados para ProcessVisualization:", {
        algorithm, quantum, ...metrics, processes: validProcesses // Incluindo os processos na visualização
      });

      setResults((prevResults) => ({
        algorithm, quantum,
        //...prevResults, 
        ...metrics, processes: validProcesses
      }));

    } catch (error) {
      console.error("Erro ao enviar os dados para o backend:", error);
      alert("Erro ao executar o algoritmo.");
    }
  };





  //Calcular métricas
  const calculateMetricsSJF = (processes) => {
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let totalExecutionTime = 0; // Variável de tempo total de execução
    let totalIdleTime = 0;
    let time = 0;
    let contextSwitches = 0;

    // Ordenar processos pelo tempo de chegada
    // Primeira ordenação
    const sortedProcesses = [...processes].sort((a, b) => a.tempoChegada - b.tempoChegada);

    //Array do tmempo restante dos processos
    const remainingTimes = sortedProcesses.map(p => parseInt(p.tempoExecucao, 10));

    //For para percorrer o array remaningTimes e somar o tempo de execução
    let totalTimeExec = 0;
    for (let i = 0; i < remainingTimes.length; i++) {
      totalTimeExec += remainingTimes[i];
    }

    const completed = new Set();
    let finishedProcesses = 0;

    while (finishedProcesses < sortedProcesses.length) {
      // Identificar processos disponíveis
      const availableProcesses = sortedProcesses
        .map((p, index) => ({ index, remainingTime: remainingTimes[index], tempoChegada: p.tempoChegada }))
        .filter(p => p.tempoChegada <= time && p.remainingTime > 0 && !completed.has(p.index));

      if (availableProcesses.length === 0) {
        time++;
        totalIdleTime++;
        continue;
      }

      // Selecionar o processo com menor tempo de execução restante
      const { index: currentIndex } = availableProcesses.reduce((min, p) => (p.remainingTime < min.remainingTime ? p : min));

      const currentProcess = sortedProcesses[currentIndex];
      const executionTime = remainingTimes[currentIndex];

      // Executar processo completamente
      time += executionTime;
      remainingTimes[currentIndex] -= executionTime;

      completed.add(currentIndex);
      finishedProcesses++;
      contextSwitches++;

      // Calcular turnaround e tempos de espera
      const finishTime = time;
      const turnaroundTime = finishTime - currentProcess.tempoChegada;
      const waitingTime = turnaroundTime - currentProcess.tempoExecucao;

      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
    }

    const cpuUtilization = ((time - totalIdleTime) / time) * 100;
    const averageWaitingTime = totalWaitingTime / sortedProcesses.length;
    const averageTurnaroundTime = totalTurnaroundTime / sortedProcesses.length;

    totalExecutionTime = totalTimeExec;
    console.log("totalExecutionTime:", totalExecutionTime);
    console.log("averageWaitingTime:", averageWaitingTime);
    console.log("totalWaitingTime:", totalWaitingTime);
    console.log("contextSwitches:", contextSwitches);
    console.log("cpuUtilization:", cpuUtilization);
    console.log("averageTurnaroundTime:", averageTurnaroundTime);

    return {
      totalExecutionTime,
      averageWaitingTime,
      averageTurnaroundTime,
      contextSwitches,
      cpuUtilization,
    };
  };


  // const calculateMetricsRR = (processes, quantum) => {
  //   console.log("PRIMEIRO QUANTUM: " + quantum);

  //   let totalWaitingTime = 0;
  //   let totalTurnaroundTime = 0;
  //   let totalIdleTime = 0;
  //   let time = 0;
  //   let contextSwitches = 0;

  //   // Ordenar processos por tempo de chegada
  //   const sortedProcesses = [...processes].sort((a, b) => a.tempoChegada - b.tempoChegada);

  //   // Inicializar tempos de execução restantes e chegada
  //   const remainingTimes = sortedProcesses.map(p => parseInt(p.tempoExecucao, 10));
  //   const arrivalTimes = sortedProcesses.map(p => parseInt(p.tempoChegada, 10));

  //   let queue = [];
  //   let finishedProcesses = 0;

  //   while (finishedProcesses < sortedProcesses.length) {
  //     // Adicionar processos que chegaram ao tempo atual à fila
  //     for (let i = 0; i < sortedProcesses.length; i++) {
  //       if (arrivalTimes[i] <= time && !queue.includes(i) && remainingTimes[i] > 0) {
  //         queue.push(i);
  //       }
  //     }

  //     if (queue.length === 0) {
  //       // Avançar o tempo se não há processos disponíveis
  //       time++;
  //       totalIdleTime++;
  //       continue;
  //     }

  //     // Obter próximo processo da fila
  //     const currentIndex = queue.shift();
  //     const currentProcess = sortedProcesses[currentIndex];

  //     // Executar o processo pelo quantum ou tempo restante, o que for menor
  //     const executionTime = Math.min(quantum, remainingTimes[currentIndex]);
  //     remainingTimes[currentIndex] -= executionTime;
  //     time += executionTime;

  //     // Incrementar troca de contexto se o processo não terminar
  //     if (queue.length > 0 || remainingTimes[currentIndex] > 0) {
  //       contextSwitches++;
  //     }

  //     // Re-adicionar à fila se o processo ainda não terminou
  //     if (remainingTimes[currentIndex] > 0) {
  //       queue.push(currentIndex);
  //     } else {
  //       // Calcular tempos de espera e turnaround quando o processo termina
  //       finishedProcesses++;
  //       const finishTime = time;
  //       const turnaroundTime = finishTime - arrivalTimes[currentIndex];
  //       const waitingTime = turnaroundTime - currentProcess.tempoExecucao;

  //       totalTurnaroundTime += turnaroundTime;
  //       totalWaitingTime += waitingTime;
  //     }
  //   }

  //   const averageWaitingTime = parseFloat((totalWaitingTime / sortedProcesses.length).toFixed(2));
  //   const averageTurnaroundTime = parseFloat((totalTurnaroundTime / sortedProcesses.length).toFixed(2));
  //   const cpuUtilization = parseFloat((((time - totalIdleTime) / time) * 100).toFixed(2));

  //   console.log("totalExecutionTime: ", time);
  //   console.log("averageWaitingTime", averageWaitingTime);
  //   console.log("totalWaitingTime", totalWaitingTime);
  //   console.log("averageTurnaroundTime", averageTurnaroundTime);
  //   console.log("contextSwitches", contextSwitches);
  //   console.log("cpuUtilization", cpuUtilization);

  //   return {
  //     totalExecutionTime: time,
  //     averageWaitingTime,
  //     averageTurnaroundTime,
  //     contextSwitches,
  //     cpuUtilization,
  //   };
  // };

  const calculateMetricsRR = (processos, quantum) => {
    console.log("Quantum: " + quantum);
  
    let tempoTotalEspera = 0;
    let tempoTotalRetorno = 0;
    let tempoTotalInativo = 0;
    let tempoAtual = 0;
    let trocasDeContexto = 0;
  
    const processosOrdenados = [...processos].sort((a, b) => a.tempoChegada - b.tempoChegada);
    const temposRestantes = processosOrdenados.map((p) => parseInt(p.tempoExecucao, 10));
    const temposChegada = processosOrdenados.map((p) => parseInt(p.tempoChegada, 10));
  
    let fila = [];
    let processosNaFila = new Set();
    let processosConcluidos = new Set();
    let processoAtivo = null; // Identifica o índice do processo em execução
  
    const adicionarNovosProcessos = () => {
      for (let i = 0; i < processosOrdenados.length; i++) {
        if (
          temposChegada[i] <= tempoAtual && // Processo chegou
          !processosNaFila.has(i) && // Não está na fila
          !processosConcluidos.has(i) && // Não está concluído
          processoAtivo !== i // Não está em execução
        ) {
          fila.push(i);
          processosNaFila.add(i);
          console.log(`Processo P${processosOrdenados[i].id} adicionado à fila.`);
        }
      }
    };
  
    while (processosConcluidos.size < processosOrdenados.length) {
      console.log(`Tempo Atual: ${tempoAtual}`);
      console.log(`Fila: [${fila.map((i) => `P${processosOrdenados[i].id}`).join(", ")}]`);
  
      adicionarNovosProcessos();
  
      if (fila.length === 0) {
        console.log("Nenhum processo na fila. CPU inativa.");
        tempoAtual++;
        tempoTotalInativo++;
        continue;
      }
  
      const indiceAtual = fila.shift();
      processosNaFila.delete(indiceAtual);
  
      if (processoAtivo !== null && processoAtivo !== indiceAtual) {
        trocasDeContexto++; // Troca de contexto porque o processo anterior foi interrompido
      }
      processoAtivo = indiceAtual; // Marca o processo atual como ativo
  
      const processoAtual = processosOrdenados[indiceAtual];
      console.log(`Executando Processo P${processoAtual.id} por até ${quantum} unidade(s).`);
  
      let tempoExecutado = 0;
      while (tempoExecutado < quantum && temposRestantes[indiceAtual] > 0) {
        temposRestantes[indiceAtual]--;
        tempoAtual++;
        tempoExecutado++;
        console.log(`  [Segundo ${tempoAtual}] Processo P${processoAtual.id} executando...`);
  
        adicionarNovosProcessos();
      }
  
      if (temposRestantes[indiceAtual] > 0) {
        fila.push(indiceAtual); // Retorna o processo para a fila
        processosNaFila.add(indiceAtual);
        console.log(`Processo P${processoAtual.id} retornou para a fila.`);
      } else {
        processosConcluidos.add(indiceAtual);
        const tempoConclusao = tempoAtual;
        const tempoRetorno = tempoConclusao - temposChegada[indiceAtual];
        const tempoEspera = tempoRetorno - processoAtual.tempoExecucao;
  
        tempoTotalRetorno += tempoRetorno;
        tempoTotalEspera += tempoEspera;
  
        console.log(`Processo P${processoAtual.id} concluído.`);
        console.log(`  Tempo de Conclusão: ${tempoConclusao}`);
        console.log(`  Tempo de Retorno: ${tempoRetorno}`);
        console.log(`  Tempo de Espera: ${tempoEspera}`);
      }
  
      processoAtivo = null; // Libera o processo ativo
      console.log(`Pilha Atual: [${fila.map((i) => `P${processosOrdenados[i].id}`).join(", ")}]`);
    }
  
    const mediaTempoEspera = parseFloat((tempoTotalEspera / processosOrdenados.length).toFixed(2));
    const mediaTempoRetorno = parseFloat((tempoTotalRetorno / processosOrdenados.length).toFixed(2));
    const utilizacaoCPU = parseFloat((((tempoAtual - tempoTotalInativo) / tempoAtual) * 100).toFixed(2));
  
    console.log("Tempo Total de Execução: ", tempoAtual);
    console.log("Média do Tempo de Espera: ", mediaTempoEspera);
    console.log("Média do Tempo de Retorno: ", mediaTempoRetorno);
    console.log("Trocas de Contexto: ", trocasDeContexto);
    console.log("Utilização da CPU: ", utilizacaoCPU);
  
    return {
      tempoTotalExecucao: tempoAtual,
      averageWaitingTime: mediaTempoEspera,
      averageTurnaroundTime: mediaTempoRetorno,
      contextSwitches: trocasDeContexto,
      cpuUtilization: utilizacaoCPU,
    };
  };
  
  
  
  
  
  
  
  












  return (
    <div className="app">
      <header className="header">
        <h1>Algoritmos Escalonados 🕐</h1>
      </header>
      <main className="main-content">
        <div className="algorithm-container">
          <AlgorithmSelector
            algorithm={algorithm}
            setAlgorithm={handleAlgorithmChange}
            quantum={quantum}
            setQuantum={setQuantum}
            setProcesses={setProcesses}
          />
          <button className="add-process-btn" onClick={addProcess}>
            + Adicionar Processo
          </button>
          <div className="process-list">
            {processes.map((process) => (
              <ProcessRow
                key={process.id}
                process={process}
                removeProcess={removeProcess}
                setProcesses={setProcesses}
              />
            ))}
          </div>
          <button className="run-btn" onClick={handleRun}>
            Rodar Algoritmos
          </button>
        </div>

        {results && (
          <>
            <ProcessVisualization results={results} processes={processes} />
            <ResultsDisplay results={results} />
          </>
        )}
      </main>

      <footer className="copyr">
        <div>
          <a
            href="https://www.linkedin.com/in/caique-augusto-braga/"
            target="_blank"
            rel="noopener noreferrer"
          >
            © All rights by Caiquekola and Monique
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
