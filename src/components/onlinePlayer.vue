<template>
<div>

  <div v-if="enemyState" class="online-player" :style="{ top:'0' }">
    <div class="player-info">
      <img :src="!isRed ? redIcon : blackIcon" alt="敌方" class="avatar">
      <div class="name-time">
        <div class="name">{{enemyState.username}}</div>
      </div>
    </div>
  </div>

  <div v-if="myState" class="online-player" :style="{ bottom:'0'}">
    <div class="player-info">
      <img :src="isRed ? redIcon : blackIcon" alt="我方" class="avatar">
      <div class="name-time">
        <div class="name">{{myState.username}}</div>
      </div>
    </div>
   </div>

</div>
</template>

<script setup>
import redIcon from '@/assets/icon/r_j.png';
import blackIcon from '@/assets/icon/b_j.png';
import { toRefs } from 'vue';
const props = defineProps({
    isRed: {
        type: Boolean,
        required: true
    },
    myState:{
        required: true
    },
    enemyState:{
        required: true
    },
})
const {myState,enemyState} = toRefs(props)
</script>

<style scoped>
.online-player {
    position: absolute;
    left: 0;
    width: 520px;
    z-index: 1000; /* 确保在其他元素之上 */
    padding: 5px;
    border-radius: 10px;
}

.player-info {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px;
    border-radius: 10px;
}

.avatar {
    margin-right: 20px;
    width: 70px;
    height: 70px;
}

.name-time {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center; /* 垂直方向居中 */
    justify-content: center; /* 水平方向居中 */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6); /* 添加阴影效果 */
    background-color: rgba(0, 0, 0, 0.7); /* 黑色，70%透明 */
    padding: 5px;
    border-radius: 12px;
    height: 70px;
    font-size: 24px;
}

.name {
    font-weight: bold;
    color: #fff533; /* 匹配绿色 */
    margin-bottom: 4px;
}

</style>
