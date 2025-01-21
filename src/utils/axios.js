import axios from 'axios'
import { showFailToast } from 'vant';
// baseURL的设置
axios.defaults.baseURL = 'http://120.26.130.74/api'
// axios.defaults.baseURL = 'http://localhost:8080'
// 允许跨域携带cookie
axios.defaults.withCredentials = true
// 用于识别axios请求
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'application/json'
 
axios.interceptors.request.use(
  (config) => {
    // 检查是否是 /auth 开头的请求
    config.headers.Token = localStorage.getItem('Token') || '';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

 axios.interceptors.response.use(res => {
   if (typeof res.data !== 'object') {
    showFailToast('服务端异常！')
     return Promise.reject(res)
   }
   if (res.data.code != "00000") {
     showFailToast(res.data.message)
     return Promise.reject(res.data)
   }
 
   return res.data.data;
 })
 
 export default axios
 