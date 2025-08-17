import axios, { AxiosInstance } from 'axios';

const BASE_URL: string = process.env.REACT_APP_BASE_URL as string;

const axiosApi: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        // allowedHeaders: '*'
    },
});

export { axiosApi };
