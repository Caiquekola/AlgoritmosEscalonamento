import { useState } from 'react';
import { scheduleProcesses } from '../services/api.js';

export function useScheduler() {
  const [state, setState] = useState({
    results: null,
    isLoading: false,
    error: null,
  });

  const runScheduler = async (processes, algorithm, quantum) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const results = await scheduleProcesses(processes, algorithm, quantum);
      setState({ results, isLoading: false, error: null });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'An unexpected error occurred',
      }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    runScheduler,
    clearError,
  };
}