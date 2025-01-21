import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { Stomp } from '@stomp/stompjs';

let client;
const subscriptionMap = new Map()
export const connectWebSocket = () =>{
  if(client) return ; 
  const token = localStorage.getItem("Token") || '';
  const socket = new SockJS(`http://120.26.130.74/api/ws?Token=${token}`);
  // const socket = new SockJS(`http://localhost:8080/ws?Token=${token}`);
  client = Stomp.over(socket);
  client.connect({}, frame => {})
}

export const subscribeTopic = (topic,callback) =>{
  if(!client) return ;
  const subscription = client.subscribe(topic,message => {
    const data = JSON.parse(message.body);
    callback(data)
  })
  subscriptionMap.set(topic, subscription);
}

export const unsubscribeTopic = (topic) => {
  if(!client) return ;
  const subscription = subscriptionMap.get(topic);
  if (subscription) {
    subscription.unsubscribe();
    subscriptionMap.delete(topic);
  }
};

export const unsubscribeAll = () => {
  if(!client) return ;
  subscriptionMap.forEach((subscription, topic) => {
    unsubscribeTopic(topic);
  });
};
export const disconnectWebSocket = () => {
  if(!client) return ;
  unsubscribeAll();
  client.disconnect(() => {});
  client = null;
};

export const sendMessage = (topic,message={}) => {
  if(!client) return 
  client.send(topic, {}, JSON.stringify(message));
}

