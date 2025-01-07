import React from 'react';
import "./ResultDisplay.css"; // Para estilos adicionais

const ResultsDisplay = ({ results }) => {
  if (!results) return null;

  return (
    <div className="results-display">
      <h2>Resultados do Algoritmo</h2>
      <div className="results-list">
        <div className="result-item">
          <p>Tempo Médio de Espera: <span>{results.averageWaitingTime.toFixed(2)} ms</span></p>
        </div>
        <div className="result-item">
          <p>Trocas de Contexto: <span>{results.contextSwitches}</span></p>
        </div>
        <div className="result-item">
          <p>Utilização da CPU: <span>{results.cpuUtilization.toFixed(2)}%</span></p>
        </div>
      </div>

      {/* Exemplo de representação visual de resultados */}
      <div className="chart-container">
        <h3>Representação Gráfica</h3>
        {/* Aqui você pode adicionar um gráfico, exemplo: */}
        <div className="cpu-utilization-bar" style={{ width: `${results.cpuUtilization}%` }}></div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
