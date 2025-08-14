import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://16.176.5.103:5001', // live
  //baseURL: 'http://3.26.96.188:5001', // test
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
