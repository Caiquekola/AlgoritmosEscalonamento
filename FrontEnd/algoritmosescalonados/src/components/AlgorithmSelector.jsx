import React from "react";

const AlgorithmSelector = ({ algorithm, setAlgorithm, quantum, setQuantum }) => {
  const handleAlgorithmChange = (newAlgorithm) => {
    if (newAlgorithm !== algorithm) {
      setAlgorithm(newAlgorithm);
      setProcesses([]); // Limpa todos os processos
    }
  };

  return (
    <div className="algorithm-selector">
      <label htmlFor="algorithm">Algoritmo</label>
      <select
        id="algorithm"
        value={algorithm}
        onChange={(e) => handleAlgorithmChange(e.target.value)}
      >
        <option value="fifo">FIFO</option>
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
            onChange={(e) => handleAlgorithmChange(e.target.value)}
          />
        </>
      )}
    </div>
  );
};

export default AlgorithmSelector;
