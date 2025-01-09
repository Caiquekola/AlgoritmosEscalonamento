import React from "react";
import "./processVisualization.css";

const ProcessVisualization = ({ results }) => {
  var {
    algorithm,
    quantum,
    processes,
    averageWaitingTime,
    averageTurnaroundTime,
    contextSwitches,
    cpuUtilization,
    totalExecutionTime,
  } = results;
  
  const colors = ["color-blue", "color-yellow", "color-purple", "color-green", "color-red"];

  const maxArrival = Math.max(...processes.map((p) => parseInt(p.tempoChegada)));
  const totalBurst = processes.reduce((sum, p) => sum + parseInt(p.tempoExecucao), 0);
  const totalTime = maxArrival + totalBurst;

  // const calculateExecutionBlocks = () => {
  //   const blocks = {};
  //   let currentTime = 0;

  //   if (algorithm === "sjf") {
  //     const sortedProcesses = [...processes].sort(
  //       (a, b) => parseInt(a.tempoChegada) - parseInt(b.tempoChegada)
  //     );

  //     sortedProcesses.forEach((process, index) => {
  //       const arrivalTime = parseInt(process.tempoChegada);
  //       const burstTime = parseInt(process.tempoExecucao);
  //       currentTime = Math.max(currentTime, arrivalTime);
  //       blocks[index] = [
  //         {
  //           start: currentTime,
  //           duration: burstTime,
  //         },
  //       ];
  //       currentTime += burstTime;
  //     });
  //   } else if (algorithm === "roundrobin") {
  //     const queue = processes.map((process, index) => ({
  //       ...process,
  //       remainingTime: parseInt(process.tempoExecucao),
  //       index,
  //     }));

  //     while (queue.length > 0) {
  //       const process = queue.shift();
  //       if (!process) break;

  //       const arrivalTime = parseInt(process.tempoChegada);
  //       if (currentTime < arrivalTime) {
  //         currentTime = arrivalTime;
  //       }

  //       const executionTime = Math.min(quantum, process.remainingTime);

  //       if (!blocks[process.index]) {
  //         blocks[process.index] = [];
  //       }
  //       blocks[process.index].push({
  //         start: currentTime,
  //         duration: executionTime,
  //       });

  //       currentTime += executionTime;
  //       process.remainingTime -= executionTime;

  //       if (process.remainingTime > 0) {
  //         queue.push(process);
  //       }
  //     }
  //   }

  //   return blocks;
  // };


  const calculateExecutionBlocks = () => {
    const blocks = {};
    let currentTime = 0;
  
    if (algorithm === "sjf") {
      const remainingProcesses = [...processes].map((process, index) => ({
        ...process,
        remainingTime: parseInt(process.tempoExecucao),
        index,
      }));
  
      while (remainingProcesses.length > 0) {
        // Seleciona o próximo processo com menor tempo de execução já disponível
        const availableProcesses = remainingProcesses.filter(
          (process) => parseInt(process.tempoChegada) <= currentTime
        );
  
        if (availableProcesses.length > 0) {
          const nextProcess = availableProcesses.reduce((prev, curr) =>
            prev.remainingTime < curr.remainingTime ? prev : curr
          );
  
          // Executa o processo
          const burstTime = nextProcess.remainingTime;
          if (!blocks[nextProcess.index]) {
            blocks[nextProcess.index] = [];
          }
          blocks[nextProcess.index].push({
            start: currentTime,
            duration: burstTime,
          });
  
          currentTime += burstTime;
          remainingProcesses.splice(
            remainingProcesses.indexOf(nextProcess),
            1
          );
        } else {
          // Avança o tempo caso nenhum processo esteja disponível
          currentTime++;
        }
      }
    }
    else if (algorithm === "roundrobin") {
      const queue = [];
      const remainingProcesses = processes.map((process, index) => ({
        ...process,
        remainingTime: parseInt(process.tempoExecucao),
        index,
      }));
    
      let currentTime = 0;
    
      while (remainingProcesses.length > 0 || queue.length > 0) {
        // Adiciona processos que chegaram no tempo atual à fila
        for (const process of remainingProcesses) {
          if (parseInt(process.tempoChegada) <= currentTime && !queue.includes(process)) {
            queue.push(process);
          }
        }
    
        // Remove os processos já adicionados à fila
        remainingProcesses.splice(
          0,
          remainingProcesses.filter((process) => parseInt(process.tempoChegada) <= currentTime).length
        );
    
        if (queue.length === 0) {
          // Avança o tempo se nenhum processo está disponível
          currentTime++;
          continue;
        }
    
        // Verifica se há apenas um processo na fila e nenhum outro a ser adicionado
        if (queue.length === 1 && remainingProcesses.length === 0) {
          const process = queue.shift();
          const executionTime = process.remainingTime;
    
          if (!blocks[process.index]) {
            blocks[process.index] = [];
          }
          blocks[process.index].push({
            start: currentTime,
            duration: executionTime,
          });
    
          currentTime += executionTime;
          process.remainingTime = 0;
          continue;
        }
    
        // Executa o próximo processo da fila
        const process = queue.shift();
        const executionTime = Math.min(quantum, process.remainingTime);
    
        if (!blocks[process.index]) {
          blocks[process.index] = [];
        }
        blocks[process.index].push({
          start: currentTime,
          duration: executionTime,
        });
    
        currentTime += executionTime;
        process.remainingTime -= executionTime;
    
        // Adiciona novos processos que chegaram enquanto o atual estava sendo executado
        for (const newProcess of remainingProcesses) {
          if (
            parseInt(newProcess.tempoChegada) > currentTime - executionTime &&
            parseInt(newProcess.tempoChegada) <= currentTime &&
            !queue.includes(newProcess)
          ) {
            queue.push(newProcess);
          }
        }
    
        // Reinsere o processo na fila se ele ainda não terminou
        if (process.remainingTime > 0) {
          queue.push(process);
        }
      }
    }
    
    
   
      
    
    return blocks;
  };
  
  const sortedProcesses = [...processes].sort((a, b) => {
    if (parseInt(a.tempoChegada) === parseInt(b.tempoChegada)) {
      return parseInt(a.prioridade) - parseInt(b.prioridade);
    }
    return parseInt(a.tempoChegada) - parseInt(b.tempoChegada);
  });

  const processExecutions = calculateExecutionBlocks();

  return (
    <div className="container">
      <h2 className="title">
         PROCESSAMENTO {algorithm === "sjf" ? "SJF" : "Round Robin"}
        {algorithm === "roundrobin" && ` (Quantum = ${quantum}s)`}
      </h2>

      <div className="stats">
        <div className="stat-box">
          <h3 className="stat-title">Tempo médio de espera</h3>
          <p className="stat-value">{Number(averageWaitingTime.toFixed(2))}s</p>
        </div>
        <div className="stat-box">
          <h3 className="stat-title">Tempo de execução médio</h3>
          <p className="stat-value">{averageTurnaroundTime.toFixed(2)}s</p>
        </div>
        <div className="stat-box">
          <h3 className="stat-title">Trocas de contexto</h3>
          <p className="stat-value">{contextSwitches}</p>
        </div>
        <div className="stat-box">
          <h3 className="stat-title">Utilização do processador</h3>
          <p className="stat-value">{cpuUtilization.toFixed(2)}%</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="process-table">
          <thead>
            <tr>
              <th>Processo</th>
              <th>Tempo chegada</th>
              <th>Tempo execução</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {sortedProcesses.map((process, index) => (
              <tr key={process.id}>
                <td>P{index + 1}</td>
                <td>{process.tempoChegada}</td>
                <td>{process.tempoExecucao}</td>
                <td>{process.prioridade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="gantt-chart">
        <div className="gantt-numbers">
          
          {Array.from({ length: totalExecutionTime }).map((_, i) => (
            <div key={i} className="gantt-number">
              {i}
            </div>
          ))}
        </div>
        {processes.map((process, index) => (
          <div key={process.id} className="gantt-row">
            {/* <div className="process-label">P{index + 1}</div> */}
            <div className="gantt-bar">
              {processExecutions[index]?.map((execution, execIndex) => (
                <div
                  key={execIndex}
                  className={`gantt-block ${colors[index % colors.length]}`}
                  style={{
                    left: `${(execution.start / (totalExecutionTime)) * 100}%`,
                    width: `${(execution.duration / (totalExecutionTime)) * 100}%`,
                  }}
                >
                  P{index + 1}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessVisualization;
