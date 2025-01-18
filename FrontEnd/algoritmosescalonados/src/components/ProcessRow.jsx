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
        value={process.tempoChegada}
        onChange={(e) => updateProcess("tempoChegada", e.target.value)}
      />
      <input
        type="number"
        placeholder="Tempo de Execução"
        value={process.tempoExecucao}
        onChange={(e) => updateProcess("tempoExecucao", e.target.value)}
      />
      {/* <input
        type="number"
        placeholder="Prioridade"
        value={process.prioridade}
        onChange={(e) => updateProcess("prioridade", e.target.value)}
      /> */}
      <button style={{backgroundColor:"red"}} onClick={() => removeProcess(process.id)}>🗑️</button>
    </div>
  );
};

export default ProcessRow;
