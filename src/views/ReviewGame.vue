<template>
    <div class="container">
      <chess-board ref="boardMethod" :ableClick="ableClick" :isRedTurn="room.playingGame.isRedTurn"></chess-board>
      <button-bars :buttons="buttons"></button-bars>
      <my-menu v-if="showMenu" :menus="menus"></my-menu>
    </div>
</template>

<script setup>
import { onMounted, ref,reactive} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChessBoard from '../components/chessBoard.vue';
import MyMenu from '../components/myMenu.vue';
import ButtonBars from '../components/buttonBars.vue';
import chessIcon from '@/assets/icon/chess.png'
import turnIcon from '@/assets/icon/turn.png'
import { initBoard } from '../constants/clasli';
import { getMoves } from '../services/game';
import { showFailToast } from 'vant';

const boardMethod = ref()
const router = useRouter();
const route = useRoute()
const ableClick = ref(false)
const room = reactive({
  currentStep:0,
  totalStep:0,
  isAuto:false,
  moveMessage:[],
  playingGame:{
    isRedTurn:true,  
    moves:[],
  }
});

const nextMove = ()=>{
  if(room.currentStep===room.totalStep){
    showFailToast("已经是最后一步了");
    return 
  }
  const move = room.playingGame.moves[room.currentStep++]
  boardMethod.value.doOrundoOneMove(move,true)
  const message = "步数" + room.currentStep + ":" + (room.playingGame.isRedTurn ? "红方 " : "黑方 ") +move.message
  room.moveMessage.push(message)
  room.playingGame.isRedTurn = !room.playingGame.isRedTurn
}

const previousMove = ()=>{
  if(room.currentStep===0){
    showFailToast("尚未走步！");
    return 
  }
  room.currentStep--;
  const move = room.currentStep? room.playingGame.moves[room.currentStep-1] : null;
  boardMethod.value.doOrundoOneMove(move,false)
  room.moveMessage.pop()
  room.playingGame.isRedTurn = !room.playingGame.isRedTurn
}

const autoNextMove = ()=>{
  if(!room.isAuto) return 
  if(room.currentStep===room.totalStep) return 
  setTimeout(()=>{
    nextMove()
    autoNextMove()
  },2000)
}

const buttons = [[
  {text:'自动',func:()=>{
    room.isAuto =!room.isAuto
    autoNextMove()
  }},
  {text:'上步',func:()=>{
    previousMove()
  }},
  {text:'下步',func:()=>{
    nextMove()
  }},
],[
  {text:'初始',func:()=>{
    InitNewGame();
  }},
  {text:'菜单',func:()=>{showMenu.value=!showMenu.value}},
  {text:'返回',func:()=>{router.go(-1)}},
]]

const showMenu = ref(false)
const menus = [
  {label:'翻转棋盘',icon:turnIcon,func:()=>{
    boardMethod.value.changeTurnOver()
    showMenu.value=false
  }},
  {
    label:'翻转棋子',icon:chessIcon,func:()=>{
    boardMethod.value.changeTurnChess()
    showMenu.value=false
    }
  }
]

const InitNewGame = ()=>{
  room.playingGame.isRedTurn =true
  room.currentStep = 0
  room.moveMessage = []
  boardMethod.value.initBoard(initBoard)
}

onMounted(async ()=>{
  InitNewGame()
  room.playingGame.moves = await getMoves(route.params.gameId)
  room.totalStep = room.playingGame.moves.length
})
</script>

<style scoped>
</style>

