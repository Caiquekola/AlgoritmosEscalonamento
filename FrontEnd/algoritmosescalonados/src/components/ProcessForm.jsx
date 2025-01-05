import React, { useState } from 'react';

const ProcessForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    algorithm: 'FIFO',
    numProcessors: 1,
    numProcesses: 1,
    processes: [{ arrivalTime: 0, executionTime: 1, priority: 0 }],
    quantum: 2,
  });

  const handleProcessChange = (index, field, value) => {
    const newProcesses = [...formData.processes];
    newProcesses[index] = { ...newProcesses[index], [field]: parseInt(value) };
    setFormData({ ...formData, processes: newProcesses });
  };

  const handleNumProcessesChange = (e) => {
    const num = parseInt(e.target.value);
    const processes = Array(num).fill().map((_, i) => ({
      arrivalTime: 0,
      executionTime: 1,
      priority: 0
    }));
    setFormData({ ...formData, numProcesses: num, processes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Algorithm</label>
        <select
          value={formData.algorithm}
          onChange={(e) => setFormData({ ...formData, algorithm: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="FIFO">FIFO</option>
          <option value="RR">Round Robin</option>
        </select>
      </div>

      {formData.algorithm === 'RR' && (
        <div>
          <label className="block text-sm font-medium">Quantum</label>
          <input
            type="number"
            min="1"
            value={formData.quantum}
            onChange={(e) => setFormData({ ...formData, quantum: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Number of Processors</label>
        <input
          type="number"
          min="1"
          value={formData.numProcessors}
          onChange={(e) => setFormData({ ...formData, numProcessors: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Number of Processes</label>
        <input
          type="number"
          min="1"
          value={formData.numProcesses}
          onChange={handleNumProcessesChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Process Details</h3>
        {formData.processes.map((process, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded">
            <div>
              <label className="block text-sm">Arrival Time</label>
              <input
                type="number"
                min="0"
                value={process.arrivalTime}
                onChange={(e) => handleProcessChange(index, 'arrivalTime', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm">Execution Time</label>
              <input
                type="number"
                min="1"
                value={process.executionTime}
                onChange={(e) => handleProcessChange(index, 'executionTime', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm">Priority</label>
              <input
                type="number"
                min="0"
                value={process.priority}
                onChange={(e) => handleProcessChange(index, 'priority', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Run Simulation
      </button>
    </form>
  );
};

export default ProcessForm;