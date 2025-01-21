<template>
    <div class="container">
      <exit :type="1"></exit>
      <div class="online-title">
        <h2>对局复盘</h2>
      </div>
      <div v-if="myGames.length"  class="game-list">
      <gameCard v-for="(game,index) in myGames" 
        :key="index" 
        @click="selectGame(game.id)"
        :stepNum="game.stepNum"
        :left="game.isRed ? game.red : game.black"
        :right="game.isRed ? game.black : game.red"
        :icons="{
          leftIcon:game.isRed ? redIcon : blackIcon,
          centerIcon:game.result===-1? vsIcon : game.result==game.isRed ? victoryIcon : defeatIcon,
          rightIcon:game.isRed ? blackIcon : redIcon ,
        }"></gameCard>
      </div>
      <div v-else class="game-list">
        <div class="no-room">您还没有过对局哦</div>
      </div>
    </div>

</template>

<script setup>
import { onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import gameCard from '../components/gameCard.vue';
import exit from '../components/exit.vue';
import redIcon from '@/assets/icon/r_j.png';
import blackIcon from '@/assets/icon/b_j.png';
import victoryIcon from '@/assets/icon/victory.png';
import defeatIcon from '@/assets/icon/defeat.png';
import vsIcon from '@/assets/icon/vs.png'
import { getMyGame } from '../services/game';
const myGames = ref([])
const router = useRouter()
const selectGame = (gameId)=>{
  router.push({ name: 'ReviewGame', params: { gameId: gameId } });
}

onMounted(async ()=>{
   myGames.value = await getMyGame(); 
})
</script>

<style scoped>
.online-title {
  display: flex;
  justify-content: center;
  height: 80px;
}
.online-title h2{
  font-size: 50px;
  margin: 10px;
}

.no-room{
  font-size: 40px; /* 设置标题大小为 6vh */
}
.game-list {
  width: 500px;
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
