const API_BASE_URL = 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function scheduleProcesses(processes, algorithm, quantum) {
  const request = {
    processes,
    algorithm,
    quantum: algorithm === 'RR' ? quantum : undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Server error: ${response.status} ${response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(undefined, `Network error: ${error.message}`);
  }
}