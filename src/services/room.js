import axios from '../utils/axios'


// 创建房间
export const joinRoom = () => {
  return axios.post(`/room/join`);
};

export const getRoom = (roomId) => {
  return axios.get(`room/${roomId}`);
};

export const listViewRooms = ()=>{
  return axios.post('/room/view/list')
}