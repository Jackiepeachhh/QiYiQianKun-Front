<template>
    <div class="container">
      <exit :type="3"></exit>
      <div class="online-title">
        <img src="@/assets/img/online-match.png" alt="象棋图标">
        <h2>联机匹配大厅</h2>
      </div>
      <div class="content-area">
        <div class="button-container">
          <div class="button-row">
            <my-button v-for="(item,index) in buttons" :key="index" :text="item.text"  :icon="item.icon" :func="item.func" ></my-button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { connectWebSocket } from '../services/stomp';
import { onMounted } from 'vue';
import exit from '../components/exit.vue';
import vsIcon from '@/assets/icon/vs.png'
import watchIcon from '@/assets/icon/watch.png'
import reviewIcon from '@/assets/icon/review.png'
import myButton from "../components/myButton.vue"
import { useRouter } from 'vue-router';
import {joinRoom} from '@/services/room'

const router = useRouter();
const quickJoinRoom = async () => {
  const data = await joinRoom();
  router.push({ name: 'Room', params: { roomId: data } });
};
const buttons = [
  { text: '快速匹配',func:quickJoinRoom ,icon:vsIcon},
  { text: '观战大厅', func:()=>{router.push('/view-hall')}, icon:watchIcon},
  { text: '对局复盘', func:()=>{router.push('/review-hall')} ,icon:reviewIcon},
];

onMounted(() => {
  connectWebSocket();
});
</script>

<style scoped>
.online-title{
  height: min(350px,40vh);
  display: flex;
  flex-direction:  column;
  align-items: center;
}

.online-title img{
  margin-top: 30px;
  width: min(300px,60vw);
}

.online-title h2{
  font-size: clamp(30px,12vw,50px);
  margin: auto;
}


.content-area {
  width: min(600px,100vw);

}

.button-row {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>