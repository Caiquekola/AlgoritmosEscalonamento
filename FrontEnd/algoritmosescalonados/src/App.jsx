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
  const [algorithm, setAlgorithm] = useState("fifo");
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

      const sortedProcesses = validProcesses.sort((a, b) => {
        if (a.prioridade === b.prioridade) {
          return a.id - b.id; // Ordem de chegada (ID)
        }
        return a.prioridade - b.prioridade; // Menor prioridade
      });

      const payload = {
        algoritmo,
        quantum: parseInt(quantum, 10),
        processos: sortedProcesses.map(({ id, ...rest }) => ({
          ...rest,
          tipo: algorithm === "fifo" ? "fifo" : "roundrobin",
        })),
      };

      // Envie para o backend apenas os dados dos processos
      const response = await axios.post(
        `http://localhost:8080/processamento/rodar?tipo=${algorithm}`,
        payload
      );

      console.log("Resposta do backend:", response.data); // Aqui você ainda verá a resposta do backend confirmando que o processamento foi salvo

      // Agora, você calcula as métricas no frontend
      const metrics = calculateMetrics(sortedProcesses,quantum);

      // Adicionando o console.log para ver os dados antes de enviar para o ProcessVisualization
      console.log("Dados enviados para ProcessVisualization:", {
        algorithm, quantum, ...metrics, processes: sortedProcesses // Incluindo os processos na visualização
      });

      setResults((prevResults) => ({ algorithm, quantum, ...prevResults, ...metrics, processes: sortedProcesses }));

    } catch (error) {
      console.error("Erro ao enviar os dados para o backend:", error);
      alert("Erro ao executar o algoritmo.");
    }
  };





 
  const calculateMetrics = (processes, quantum) => {
    console.log("PRIMEIRO QUANTUM: "+quantum)
    let totalWaitingTime = 0;
    let totalExecutionTime = 0;
    let totalIdleTime = 0;
    let lastEndTime = 0;

    const sortedProcesses = [...processes].sort((a, b) => a.tempoChegada - b.tempoChegada);

    sortedProcesses.forEach((process, index) => {
      const arrivalTime = parseInt(process.tempoChegada || 0, 10);
      const burstTime = parseInt(process.tempoExecucao || 0, 10);

      const startTime = index === 0 ? arrivalTime : Math.max(lastEndTime, arrivalTime);
      const waitingTime = startTime - arrivalTime;
      totalWaitingTime += waitingTime;
      totalExecutionTime += burstTime;

      if (arrivalTime > lastEndTime) {
        totalIdleTime += arrivalTime - lastEndTime;
      }

      lastEndTime = startTime + burstTime;
    });

    let queue = [...sortedProcesses];
    console.log(sortedProcesses)
    let time = 0;
    let contextSwitches = 0;
    console.log("queue.length>" + (queue.length > 0));


    while (queue.length > 0) {
      const currentProcess = queue.shift();
      console.log("currentProcess " + currentProcess.tempoChegada)
      let remainingTime = parseInt(currentProcess.tempoExecucao, 10);
      console.log("remainingTime "+remainingTime);
      // Verifica se o tempo restante é maior que o quantum e se há mais de um processo na fila
      console.log("remainingTime > quantum: "+(remainingTime > quantum));
      console.log("quantum"+quantum);
      while (remainingTime > quantum) {
        // Executa o quantum e incrementa o tempo
        remainingTime -= quantum;
        time += quantum;

        // Se houver mais de um processo na fila, troca o processo
        console.log("queue.length dentro do while>" + (queue.length > 0));

        if (queue.length > 0) {
          contextSwitches++; // Incrementa a troca de contexto
        }

        // Coloca o processo de volta na fila com o tempo restante
        queue.push({ ...currentProcess, tempoExecucao: remainingTime });
      }

      // Executa o que restou do processo, que é menor ou igual ao quantum
      if (remainingTime > 0) {
        time += remainingTime;
      }

      
    }


    // Exiba o número de trocas de contexto
    console.log(`Context switches: ${contextSwitches}`);




    const cpuUtilization = (totalExecutionTime / (totalExecutionTime + totalIdleTime)) * 100;
    const averageWaitingTime = sortedProcesses.length > 0 ? totalWaitingTime / (sortedProcesses.length - 1) : 0;
    const averageTurnaroundTime = sortedProcesses.length > 0 ? (totalExecutionTime) / sortedProcesses.length : 0; //Turnaround corrigido

    console.log("averageWaitingTime", averageWaitingTime);
    console.log("totalWaitingTime", totalWaitingTime);
    console.log("processes.length", processes.length);
    console.log("contextSwitches: ", contextSwitches);
    console.log("cpuUtilization", cpuUtilization);
    console.log("averageTurnaroundTime", averageTurnaroundTime);

    return {
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
