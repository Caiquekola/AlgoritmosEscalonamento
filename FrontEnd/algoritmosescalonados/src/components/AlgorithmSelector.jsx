import React from "react";

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
    <div className="algorithm-selector">
      <label htmlFor="algorithm">Algoritmo</label>
      <select
        id="algorithm"
        value={algorithm}
        onChange={(e) => handleAlgorithmChange(e.target.value)}
      >
        <option value="sjf">SJF</option>
        <option value="roundrobin">Round Robin</option>
        {/* Adicione outros algoritmos aqui */}
      </select>

      {algorithm === "roundrobin" && (
        <>
          <label htmlFor="quantum">Quantum</label>
          <input
            type="number"
            id="quantum"
            value={quantum}
            onChange={handleQuantumChange} // Atualiza o valor de quantum
          />
        </>
      )}
    </div>
  );
};

export default AlgorithmSelector;
