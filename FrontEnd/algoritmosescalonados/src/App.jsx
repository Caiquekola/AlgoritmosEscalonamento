import React, { useState } from "react";
import AlgorithmSelector from "./components/AlgorithmSelector";
import ProcessRow from "./components/ProcessRow";
import "./App.css";

const App = () => {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState("fifo");
  const [quantum, setQuantum] = useState(0);

  const addProcess = () => {
    setProcesses([
      ...processes,
      { id: Date.now(), arrivalTime: "", executionTime: "", priority: "" },
    ]);
  };

  const removeProcess = (id) => {
    setProcesses(processes.filter((process) => process.id !== id));
  };

  const handleRun = async () => {
    try {
      const payload = {
        algorithm,
        quantum: parseInt(quantum, 10),
        processes: processes.map(({ id, ...rest }) => rest), // Remove o campo "id"
      };
  
      const response = await axios.post("http://localhost:8080/scheduler/run", payload);
      console.log("Resposta do backend:", response.data);
      alert("Resultado: " + response.data);
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
            setAlgorithm={setAlgorithm}
            quantum={quantum}
            setQuantum={setQuantum}
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
      </main>

      <footer className="copyr">
        <div>
          <a  href="https://www.linkedin.com/in/caique-augusto-braga/" target="_blank" >
            © All rights by Caiquekola and Monique
          </a>
        </div>
      </footer>

    </div>
  );
};

export default App;
