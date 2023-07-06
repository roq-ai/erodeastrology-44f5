import axios from 'axios';
import queryString from 'query-string';
import { BirthChartInterface, BirthChartGetQueryInterface } from 'interfaces/birth-chart';
import { GetQueryInterface } from '../../interfaces';

export const getBirthCharts = async (query?: BirthChartGetQueryInterface) => {
  const response = await axios.get(`/api/birth-charts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBirthChart = async (birthChart: BirthChartInterface) => {
  const response = await axios.post('/api/birth-charts', birthChart);
  return response.data;
};

export const updateBirthChartById = async (id: string, birthChart: BirthChartInterface) => {
  const response = await axios.put(`/api/birth-charts/${id}`, birthChart);
  return response.data;
};

export const getBirthChartById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/birth-charts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBirthChartById = async (id: string) => {
  const response = await axios.delete(`/api/birth-charts/${id}`);
  return response.data;
};
