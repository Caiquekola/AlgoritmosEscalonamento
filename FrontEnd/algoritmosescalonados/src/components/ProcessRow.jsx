import React from "react";

const ProcessRow = ({ process, removeProcess, setProcesses }) => {
  const updateProcess = (key, value) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === process.id ? { ...p, [key]: value } : p
      )
    );
  };

  return (
    <div className="process-row">
      <input
        type="number"
        placeholder="Tempo de Chegada"
        value={process.arrivalTime}
        onChange={(e) => updateProcess("arrivalTime", e.target.value)}
      />
      <input
        type="number"
        placeholder="Tempo de Execução"
        value={process.executionTime}
        onChange={(e) => updateProcess("executionTime", e.target.value)}
      />
      <input
        type="number"
        placeholder="Prioridade"
        value={process.priority}
        onChange={(e) => updateProcess("priority", e.target.value)}
      />
      <button onClick={() => removeProcess(process.id)}>🗑️</button>
    </div>
  );
};

export default ProcessRow;
