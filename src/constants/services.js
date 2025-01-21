const API_BASE_URL = 'http://localhost:8080';
const SOCKET_CONNECT_URL =  (token) => API_BASE_URL + `/ws?Token=${token}`;
