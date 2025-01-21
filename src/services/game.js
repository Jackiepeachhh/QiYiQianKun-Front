import axios from '../utils/axios'

export function getMyGame() {
  return axios.post('/game/list');
}

export function getMoves(gameId) {
  return axios.get(`/game/moves/${gameId}`);
}