import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProcessVisualization = ({ results }) => {
  if (!results) return null;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Process Execution Timeline',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const data = {
    labels: results.processes.map((_, index) => `Process ${index + 1}`),
    datasets: [
      {
        label: 'Waiting Time',
        data: results.processes.map(p => p.tempoEspera),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Execution Time',
        data: results.processes.map(p => p.tempoExecucao),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Simulation Results</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Average Waiting Time:</p>
            <p>{results.averageWaitingTime.toFixed(2)} units</p>
          </div>
          <div>
            <p className="font-medium">Average Turnaround Time:</p>
            <p>{results.averageTurnaroundTime.toFixed(2)} units</p>
          </div>
          <div>
            <p className="font-medium">Context Switches:</p>
            <p>{results.contextSwitches}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default ProcessVisualization;