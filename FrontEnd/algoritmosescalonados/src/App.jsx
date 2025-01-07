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

    

    const addProcess = () => {
      setProcesses([
        ...processes,
        { id: Date.now(), tempoChegada: "", tempoExecucao: "", prioridade: "" },
      ]);
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
        if(algorithm==="sjf"){
          metrics = calculateMetricsSJF(validProcesses);
        }else{
          metrics = calculateMetricsRR(validProcesses,quantum);
        }

        // Adicionando o console.log para ver os dados antes de enviar para o ProcessVisualization
        console.log("Dados enviados para ProcessVisualization:", {
          algorithm, quantum, ...metrics, processes: validProcesses // Incluindo os processos na visualização
        });

        setResults((prevResults) => ({ algorithm, quantum, 
          //...prevResults, 
          ...metrics, processes: validProcesses }));

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
      for(let i = 0;i<remainingTimes.length;i++){
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


    const calculateMetricsRR = (processes, quantum) => {
      console.log("PRIMEIRO QUANTUM: " + quantum);
    
      let totalWaitingTime = 0;
      let totalExecutionTime = 0;
      let totalIdleTime = 0;
      let time = 0;
      let contextSwitches = 0;
    
      // Ordenar processos inicialmente pelo tempo de chegada
      const sortedProcesses = [...processes].sort((a, b) => a.tempoChegada - b.tempoChegada);
    
      // Copiar tempos de execução e chegada para controle
      const remainingTimes = sortedProcesses.map(p => parseInt(p.tempoExecucao, 10));
      const arrivalTimes = sortedProcesses.map(p => parseInt(p.tempoChegada, 10));
    
      let queue = [];
      let finishedProcesses = 0;
    
      let totalTimeExec = 0;
      for(let i = 0;i<remainingTimes.length;i++){
        totalTimeExec += remainingTimes[i];
      }

      while (finishedProcesses < sortedProcesses.length) {
        // Adicionar processos que chegaram ao tempo atual à fila
        for (let i = 0; i < sortedProcesses.length; i++) {
          if (arrivalTimes[i] <= time && !queue.includes(i) && remainingTimes[i] > 0) {
            queue.push(i);
          }
        }
    
        if (queue.length === 0) {
          // Avançar o tempo se nenhum processo estiver disponível
          time++;
          totalIdleTime++;
          continue;
        }
    
        // Pegar o próximo processo da fila (FIFO)
        const currentIndex = queue.shift();
        const currentProcess = sortedProcesses[currentIndex];
    
        // Executar o processo pelo quantum ou pelo tempo restante, o que for menor
        const executionTime = Math.min(quantum, remainingTimes[currentIndex]);
        remainingTimes[currentIndex] -= executionTime;
        time += executionTime;
    
        // Incrementar troca de contexto se ainda há processos na fila ou se o processo será re-adicionado
        if (queue.length > 0 || remainingTimes[currentIndex] > 0) {
          contextSwitches++;
        }
    
        // Se o processo ainda não terminou, volte para o final da fila
        if (remainingTimes[currentIndex] > 0) {
          queue.push(currentIndex);
        } else {
          // Calcular tempos de espera e término
          finishedProcesses++;
          const finishTime = time;
          const turnaroundTime = finishTime - currentProcess.tempoChegada;
          const waitingTime = turnaroundTime - currentProcess.tempoExecucao;
    
          totalWaitingTime += waitingTime;
        }
      }
    
      const cpuUtilization = (totalExecutionTime / (totalExecutionTime + totalIdleTime)) * 100;
      const averageWaitingTime = totalWaitingTime / sortedProcesses.length;
      const averageTurnaroundTime = totalExecutionTime / sortedProcesses.length;
      
      totalExecutionTime = totalTimeExec;

      console.log("totalExecutionTime: ", totalExecutionTime);
      console.log("averageWaitingTime", averageWaitingTime);
      console.log("totalWaitingTime", totalWaitingTime);
      console.log("contextSwitches", contextSwitches);
      console.log("cpuUtilization", cpuUtilization);
      console.log("averageTurnaroundTime", averageTurnaroundTime);
    
      return {
        totalExecutionTime,
        averageWaitingTime,
        averageTurnaroundTime,
        contextSwitches,
        cpuUtilization,
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
