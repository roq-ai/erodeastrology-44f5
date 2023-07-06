import axios from 'axios';
import queryString from 'query-string';
import { PredictionInterface, PredictionGetQueryInterface } from 'interfaces/prediction';
import { GetQueryInterface } from '../../interfaces';

export const getPredictions = async (query?: PredictionGetQueryInterface) => {
  const response = await axios.get(`/api/predictions${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPrediction = async (prediction: PredictionInterface) => {
  const response = await axios.post('/api/predictions', prediction);
  return response.data;
};

export const updatePredictionById = async (id: string, prediction: PredictionInterface) => {
  const response = await axios.put(`/api/predictions/${id}`, prediction);
  return response.data;
};

export const getPredictionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/predictions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePredictionById = async (id: string) => {
  const response = await axios.delete(`/api/predictions/${id}`);
  return response.data;
};
