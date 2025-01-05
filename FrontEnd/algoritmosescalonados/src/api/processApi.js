import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const processApi = {
  submitProcesses: async (algorithm, processes) => {
    return axios.post(`${API_BASE_URL}/process/${algorithm}`, processes);
  },
  
  getResults: async (id) => {
    return axios.get(`${API_BASE_URL}/process/results/${id}`);
  }
};

