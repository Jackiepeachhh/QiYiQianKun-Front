<template>
  <div class="container">
    <Title></Title>
    <div class="content-area">
      <div class="button-container">
        <div class="button-row">
          <my-button v-for="(item,index) in buttons" 
            :key="index" 
            :text="item.text" 
            :icon="item.icon" 
            :func="item.func"
          ></my-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import Title from '../components/title.vue';
import { onMounted } from 'vue';
import { disconnectWebSocket } from '../services/stomp';
import myButton from "../components/myButton.vue"
import aiIcon from '@/assets/icon/ai.png'
import challengIcon from '@/assets/icon/challeng.png'
import onlineIcon from '@/assets/icon/online.png'
import { useRouter } from 'vue-router';

const router = useRouter();
// 定义按钮文本和链接
const buttons = [
  { text: '人机对战',icon:aiIcon,func:()=>{router.push("/ai")}},
  { text: '残局挑战',icon:challengIcon,func:()=>{router.push("/challenge")}},
  { text: '联机对战',icon:onlineIcon,func:()=>{router.push("/online")}},
];

onMounted(() => {
  disconnectWebSocket();
});
</script>

<style scoped>


.content-area {
  width: min(600px,100vw);
  display: flex;
  justify-content: center;
  align-items: center;
}


.button-row {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
