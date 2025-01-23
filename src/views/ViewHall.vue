<template>
    <div class="container">
      <exit :type="1"></exit>
      <div class="online-title">
        <h2>观战大厅</h2>
      </div>
      <div v-if="viewRooms.length"  class="game-list">
      <gameCard 
        v-for="(room,index) in viewRooms" 
        :key="index" 
        @click="selectViewRoom(room.roomId)"
        :viewNum="room.viewNum"
        :stepNum="room.stepNum"
        :left="room.redPlayer.username"
        :right="room.blackPlayer.username"
        :icons="{
          centerIcon:vsIcon,
          leftIcon:redIcon,
          rightIcon: blackIcon,
        }"></gameCard>
      </div>
      <div v-else class="game-list">
        <div class="no-room">暂无观战房间</div>
      </div>
    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import gameCard from '../components/gameCard.vue';
import exit from '../components/exit.vue';
import redIcon from '@/assets/icon/r_j.png';
import blackIcon from '@/assets/icon/b_j.png';
import vsIcon from '@/assets/icon/vs.png'
import {listViewRooms } from '@/services/room'  
const viewRooms = ref([])
const router = useRouter()
const selectViewRoom = (roomId)=>{
  router.push({ name: 'ViewRoom', params: { roomId: roomId } });
}
const fetchViewRooms = async ()=>{ 
  viewRooms.value = await listViewRooms()
}

onMounted(async ()=>{
  fetchViewRooms()
})
</script>

<style scoped>
.online-title {
  display: flex;
  justify-content: center;
  height: 80px;
}
.online-title h2{
  font-size: clamp(30px,12vw,50px);
  margin: 10px;
}

.no-room{
  font-size: clamp(24px,10vw,40px); /* 设置标题大小为 6vh */
}
.game-list {
  width: min(500px,90vw);
  height: calc(95% - 80px); 
  display: flex; 
  padding: 10px;
  border-radius: 12px;
  background-color: rgba(255,255,255,0.7);
  flex-direction: column; /* 设置为列排列 */
  align-items: center; /* 水平居中 */
  overflow-y: auto; /* 允许纵向滚动 */
  margin: 0 auto;
}
</style>
