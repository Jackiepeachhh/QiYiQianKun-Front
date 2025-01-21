import axios from '../utils/axios'

export function userLogin(params) {
  return axios.post('/user/login', params);
}

export function userRegister(params) {
  return axios.post('/user/register', params);
}

export function checkLoginStatus() {
  return axios.get(`/user/auth`);
}