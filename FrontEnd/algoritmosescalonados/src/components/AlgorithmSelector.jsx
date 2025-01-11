import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const AlgorithmSelector = ({ algorithm, setAlgorithm, quantum, setQuantum, setProcesses }) => {
  const handleAlgorithmChange = (newAlgorithm) => {
    if (newAlgorithm !== algorithm) {
      setAlgorithm(newAlgorithm);
      setProcesses([]); // Limpa todos os processos ao mudar o algoritmo
    }
  };

  const handleQuantumChange = (event) => {
    const value = event.target.value;
    setQuantum(value);
  };

  return (
    <div className="algorithm-selector mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <label htmlFor="algorithm" className="form-label mb-0">Algoritmo</label>
        <select
          id="algorithm"
          className="form-select form-select-sm w-auto"
          value={algorithm}
          onChange={(e) => handleAlgorithmChange(e.target.value)}
        >
          <option value="sjf">SJF</option>
          <option value="roundrobin">Round Robin</option>
          {/* Adicione outros algoritmos aqui */}
        </select>
      </div>

      {algorithm === "roundrobin" && (
        <div className="mt-2 d-flex justify-content-between align-items-center">
          <label htmlFor="quantum" className="form-label">Quantum</label>
          <input
            type="number"
            id="quantum"
            className="form-control form-control-sm w-auto"
            value={quantum}
            onChange={handleQuantumChange} // Atualiza o valor de quantum
          />
        </div>
      )}
    </div>
  );
};

export default AlgorithmSelector;
