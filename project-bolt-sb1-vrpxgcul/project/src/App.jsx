import { useState } from 'react';
import ProcessForm from './components/ProcessForm';
import ProcessVisualization from './components/ProcessVisualization';
import { processApi } from './api/processApi';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await processApi.submitProcesses(
        formData.algorithm.toLowerCase(),
        {
          processes: formData.processes,
          numProcessors: formData.numProcessors,
          quantum: formData.quantum
        }
      );
      setResults(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Process Scheduler Simulator
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <ProcessForm onSubmit={handleSubmit} />
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Processing...</p>
            </div>
          ) : (
            results && <ProcessVisualization results={results} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;