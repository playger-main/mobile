// src\effector\api.ts
import axios from 'axios';

const BASE_URL = 'https://playground-back-production.up.railway.app';

export const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



