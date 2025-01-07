// import React from 'react';

// const ProcessVisualization = ({
//   results
// }) => {

//   const { algorithm, quantum, processes, averageWaitingTime, averageTurnaroundTime, contextSwitches, cpuUtilization } = results;
//   const colors = ['bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500'];

//   const maxArrival = Math.max(...processes.map(p => parseInt(p.tempoChegada)));
//   const totalBurst = processes.reduce((sum, p) => sum + parseInt(p.tempoExecucao), 0);
//   const totalTime = maxArrival + totalBurst;

//   // const calculateExecutionBlocks = () => {
//   //   const blocks = {};
//   //   let currentTime = 0;

//   //   if (algorithm === 'fifo') {
//   //     const sortedProcesses = [...processes].sort((a, b) => 
//   //       parseInt(a.tempoChegada) - parseInt(b.tempoChegada)
//   //     );

//   //     sortedProcesses.forEach((process, index) => {
//   //       const arrivalTime = parseInt(process.tempoChegada);
//   //       const burstTime = parseInt(process.tempoExecucao);
//   //       currentTime = Math.max(currentTime, arrivalTime);
//   //       blocks[index] = [{
//   //         start: currentTime,
//   //         duration: burstTime
//   //       }];
//   //       currentTime += burstTime;
//   //     });
//   //   } else if (algorithm === 'roundrobin') {
//   //     const queue = processes.map((process, index) => ({
//   //       ...process,
//   //       remainingTime: parseInt(process.tempoExecucao),
//   //       index
//   //     }));

//   //     while (queue.length > 0) {
//   //       const process = queue.shift();
//   //       if (!process) break;

//   //       const arrivalTime = parseInt(process.tempoChegada);
//   //       if (currentTime < arrivalTime) {
//   //         currentTime = arrivalTime;
//   //       }

//   //       const executionTime = Math.min(quantum, process.remainingTime);

//   //       if (!blocks[process.index]) {
//   //         blocks[process.index] = [];
//   //       }
//   //       blocks[process.index].push({
//   //         start: currentTime,
//   //         duration: executionTime
//   //       });

//   //       currentTime += executionTime;
//   //       process.remainingTime -= executionTime;

//   //       if (process.remainingTime > 0) {
//   //         queue.push(process);
//   //       }
//   //     }
//   //   }

//   //   return blocks;
//   // };

//   const calculateExecutionBlocks = () => {
//     const blocks = {};
//     let currentTime = 0;

//     if (algorithm === 'fifo') {
//       const sortedProcesses = [...processes].sort((a, b) => 
//         parseInt(a.tempoChegada) - parseInt(b.tempoChegada)
//       );

//       sortedProcesses.forEach((process, index) => {
//         const arrivalTime = parseInt(process.tempoChegada);
//         const burstTime = parseInt(process.tempoExecucao);
//         currentTime = Math.max(currentTime, arrivalTime);
//         blocks[index] = [{
//           start: currentTime,
//           duration: burstTime
//         }];
//         currentTime += burstTime;
//       });
//     } else if (algorithm === 'roundrobin') {
//       const queue = processes.map((process, index) => ({
//         ...process,
//         remainingTime: parseInt(process.tempoExecucao),
//         index
//       }));

//       while (queue.length > 0) {
//         const process = queue.shift();
//         if (!process) break;

//         const arrivalTime = parseInt(process.tempoChegada);
//         if (currentTime < arrivalTime) {
//           currentTime = arrivalTime;
//         }

//         const executionTime = Math.min(quantum, process.remainingTime);

//         if (!blocks[process.index]) {
//           blocks[process.index] = [];
//         }
//         blocks[process.index].push({
//           start: currentTime,
//           duration: executionTime
//         });

//         currentTime += executionTime;
//         process.remainingTime -= executionTime;

//         if (process.remainingTime > 0) {
//           queue.push(process);
//         }
//       }
//     }

//     return blocks;
//   };

//   const processExecutions = calculateExecutionBlocks();

//   return (
//     <div className="p-8 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-6">
//         {algorithm === 'fifo' ? 'FIFO' : 'Round Robin'} Process Scheduling
//         {algorithm === 'roundrobin' && ` (Quantum = ${quantum}s)`}
//       </h2>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-sm font-semibold text-gray-600">Average Waiting Time</h3>
//           <p className="text-2xl font-bold">{averageWaitingTime.toFixed(2)}s</p>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-sm font-semibold text-gray-600">Average Turnaround Time</h3>
//           <p className="text-2xl font-bold">{averageTurnaroundTime.toFixed(2)}s</p>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-sm font-semibold text-gray-600">Context Switches</h3>
//           <p className="text-2xl font-bold">{contextSwitches}</p>
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-sm font-semibold text-gray-600">CPU Utilization</h3>
//           <p className="text-2xl font-bold">{cpuUtilization}%</p>
//         </div>
//       </div>

//       <div className="mb-8 overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2">Process</th>
//               <th className="px-4 py-2">Arrival Time</th>
//               <th className="px-4 py-2">Burst Time</th>
//               <th className="px-4 py-2">Priority</th>
//             </tr>
//           </thead>
//           <tbody>
//             {processes.map((process, index) => (
//               <tr key={process.id} className="border-t">
//                 <td className="px-4 py-2">P{index + 1}</td>
//                 <td className="px-4 py-2">{process.tempoChegada}</td>
//                 <td className="px-4 py-2">{process.tempoExecucao}</td>
//                 <td className="px-4 py-2">{process.prioridade}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="mb-8">
//         <h3 className="text-lg font-semibold mb-4">Gantt Chart</h3>
//         <div className="relative">
//           <div className="flex justify-between mb-2">
//             {Array.from({ length: totalTime + 1 }).map((_, i) => (
//               <div key={i} className="text-xs">{i}</div>
//             ))}
//           </div>

//           {processes.map((process, index) => (
//             <div key={process.id} className="flex items-center mb-2">
//               <div className="w-16 mr-2 text-sm font-medium">P{index + 1}</div>
//               <div className="flex-1 h-8 bg-gray-100 relative">
//                 {processExecutions[index]?.map((execution, execIndex) => (
//                   <div
//                     key={execIndex}
//                     className={`absolute h-full ${colors[index % colors.length]} border-l border-r border-gray-300`}
//                     style={{
//                       left: `${(execution.start / totalTime) * 100}%`,
//                       width: `${(execution.duration / totalTime) * 100}%`,
//                     }}
//                   >
//                     <div className="text-xs text-white font-bold h-full flex items-center justify-center">
//                       P{index + 1}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-4">
//         {processes.map((_, index) => (
//           <div key={index} className="flex items-center">
//             <div className={`w-4 h-4 ${colors[index % colors.length]} mr-2`}></div>
//             <span className="text-sm">Process {index + 1}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProcessVisualization;

import React from "react";
import "./processVisualization.css";

const ProcessVisualization = ({ results }) => {
  const {
    algorithm,
    quantum,
    processes,
    averageWaitingTime,
    averageTurnaroundTime,
    contextSwitches,
    cpuUtilization,
  } = results;

  const colors = ["color-blue", "color-yellow", "color-purple", "color-green", "color-red"];

  const maxArrival = Math.max(...processes.map((p) => parseInt(p.tempoChegada)));
  const totalBurst = processes.reduce((sum, p) => sum + parseInt(p.tempoExecucao), 0);
  const totalTime = maxArrival + totalBurst;

  const calculateExecutionBlocks = () => {
    const blocks = {};
    let currentTime = 0;

    if (algorithm === "fifo") {
      const sortedProcesses = [...processes].sort(
        (a, b) => parseInt(a.tempoChegada) - parseInt(b.tempoChegada)
      );

      sortedProcesses.forEach((process, index) => {
        const arrivalTime = parseInt(process.tempoChegada);
        const burstTime = parseInt(process.tempoExecucao);
        currentTime = Math.max(currentTime, arrivalTime);
        blocks[index] = [
          {
            start: currentTime,
            duration: burstTime,
          },
        ];
        currentTime += burstTime;
      });
    } else if (algorithm === "roundrobin") {
      const queue = processes.map((process, index) => ({
        ...process,
        remainingTime: parseInt(process.tempoExecucao),
        index,
      }));

      while (queue.length > 0) {
        const process = queue.shift();
        if (!process) break;

        const arrivalTime = parseInt(process.tempoChegada);
        if (currentTime < arrivalTime) {
          currentTime = arrivalTime;
        }

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

        if (process.remainingTime > 0) {
          queue.push(process);
        }
      }
    }

    return blocks;
  };

  const processExecutions = calculateExecutionBlocks();

  return (
    <div className="container">
      <h2 className="title">
         PROCESSAMENTO {algorithm === "fifo" ? "FIFO" : "Round Robin"}
        {algorithm === "roundrobin" && ` (Quantum = ${quantum}s)`}
      </h2>

      <div className="stats">
        <div className="stat-box">
          <h3 className="stat-title">Tempo médio de espera</h3>
          <p className="stat-value">{averageWaitingTime.toFixed(2)}s</p>
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
            {processes.map((process, index) => (
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
          {Array.from({ length: totalTime + 1 }).map((_, i) => (
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
                    left: `${(execution.start / totalTime) * 100}%`,
                    width: `${(execution.duration / totalTime) * 100}%`,
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
