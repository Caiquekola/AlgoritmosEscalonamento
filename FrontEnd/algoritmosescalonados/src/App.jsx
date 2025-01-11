import React, { useState } from "react";
import AlgorithmSelector from "./components/AlgorithmSelector";
import ProcessRow from "./components/ProcessRow";
import axios from "axios";
import ProcessVisualization from "./components/ProcessVisualization";
// import ResultsDisplay from "./components/ResultDisplay";
import { calculateMetricsRR,calculateMetricsSJF } from "./hooks/algorithm/calculateMetrics";
import 'bootstrap/dist/css/bootstrap.min.css';
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
    if(processes.length===0){
      return false;
    }
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
      console.log("Valid Processes ",validProcesses);
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
          <button className="add-process-btn"  onClick={addProcess}>
            ➕ Adicionar Processo
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
            {/* <ResultsDisplay results={results} /> */}
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
