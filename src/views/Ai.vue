<template>
<div class="bg">
  <div class="container">
    <chess-board ref="boardMethod" 
      :ableClick="ableClick" 
      :isRedTurn="room.playingGame.isRedTurn" 
      @move="handleMove" 
      @checkMate="handleCheckMate"></chess-board>
    <button-bars :buttons="buttons"></button-bars>
    <my-setting v-if="showNewGameSetting" :setings="newGameSetting" :value="newRoom"></my-setting>
    <my-setting v-if="showCurrentSetting" :setings="cureentSetting" :value="room"></my-setting>
    <my-menu v-if="showMenu" :menus="menus"></my-menu>
  </div>
</div>
</template>

<script setup>
import { onMounted, ref,reactive} from 'vue';
import { useRouter } from 'vue-router';
import ChessBoard from '../components/chessBoard.vue';
import MySetting from '../components/mySetting.vue';
import MyMenu from '../components/myMenu.vue';
import ButtonBars from '../components/buttonBars.vue';
import chessIcon from '@/assets/icon/chess.png'
import turnIcon from '@/assets/icon/turn.png'
import { aiLevelOpts, chessSetOpts, playerOpts} from '../constants';
import { bestMove } from '../utils/ai';
import { getBoardBySetting } from '../utils/board';

const boardMethod = ref()
const router = useRouter();

const ableClick = ref(false)
const room = reactive({
  isRedAI:false,
  isBlackAI:true,
  AILevel:2,
  isPlaying:true,
  playingGame:{
    isRedTurn:true,  
    moves:[],
  }
});

const buttons = [[
  {text:'新局',func:()=>{showNewGameSetting.value=true}},
  {text:'设置',func:()=>{showCurrentSetting.value=true}},
  {text:'悔棋',func:()=>{undoMove()}},
],[
  {text:'菜单',func:()=>{showMenu.value=!showMenu.value}},
  {text:'提示',func:()=>{setTimeout(()=>AiMove(true),1000);}},
  {text:'返回',func:()=>{router.push('/')}},
]]


const showNewGameSetting = ref(false)
const newRoom = reactive({
  redChessSeting:0,
  blackChessSeting:0,
  isRedAI:false,
  isBlackAI:true,
  AILevel:2,
})
const InitNewGame = ()=>{
  showNewGameSetting.value = false
  room.AILevel = newRoom.AILevel
  room.isRedAI = newRoom.isRedAI
  room.isBlackAI = newRoom.isBlackAI
  room.isPlaying = true
  room.playingGame.isRedTurn =true
  room.playingGame.moves = [];

  const initBoard = getBoardBySetting(newRoom.redChessSeting,newRoom.blackChessSeting)
  boardMethod.value.initBoard(initBoard)
  ableClick.value = true
  if(room.playingGame.isRedTurn ? room.isRedAI : room.isBlackAI) setTimeout(AiMove,1000);
}

const newGameSetting ={
  title: '新局设置',
  options:[
  {label:'红 方',type:'option',prop:'isRedAI' ,option:playerOpts},
  {label:'黑 方',type:'option',prop:'isBlackAI' ,option:playerOpts},
  {label:'红方让子',type:'option',prop:'redChessSeting' ,option:chessSetOpts},
  {label:'黑方让子',type:'option',prop:'blackChessSeting' ,option:chessSetOpts},
  {label:'电脑水平',type:'option',prop:'AILevel' ,option:aiLevelOpts},
  ],
  buttons:[
    { label:'返回对局',func:()=>{ showNewGameSetting.value = false }},
    { label:'开始游戏',func:InitNewGame}
  ]
} 
const showCurrentSetting = ref(false)
const cureentSetting = {
  title: '对局设置',
  options:[
  {label:'红 方',type:'option',prop:'isRedAI' ,option:playerOpts},
  {label:'黑 方',type:'option',prop:'isBlackAI' ,option:playerOpts},
  {label:'电脑水平',type:'option',prop:'AILevel' ,option:aiLevelOpts},
  ],
  buttons:[
    { label:'返回对局',func:()=>{ 
      showCurrentSetting.value = false
      if(room.playingGame.isRedTurn ? room.isRedAI : room.isBlackAI) setTimeout(AiMove,1000); 
    }},
  ]
}

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

const undoMove = ()=>{
  if(!room.playingGame.moves.length) return 
  if(room.isRedAI && room.isBlackAI) return 
  room.playingGame.moves.pop();
  const lastMove = room.playingGame.moves.length-1>=0 ? room.playingGame.moves[room.playingGame.moves.length-1] : null;
  boardMethod.value.doOrundoOneMove(lastMove,false);
  room.playingGame.isRedTurn = !room.playingGame.isRedTurn
  ableClick.value = room.isPlaying && room.playingGame.isRedTurn ? !room.isRedAI : !room.isBlackAI
  if(room.playingGame.isRedTurn ? room.isRedAI : room.isBlackAI) setTimeout(undoMove,1000)
}

const handleMove=(move)=>{
  room.playingGame.moves.push(move)
  boardMethod.value.doOrundoOneMove(move,true)
  room.playingGame.isRedTurn = !room.playingGame.isRedTurn
  ableClick.value = room.isPlaying && room.playingGame.isRedTurn ? !room.isRedAI : !room.isBlackAI
  if(room.playingGame.isRedTurn? room.isRedAI : room.isBlackAI) setTimeout(AiMove,1000);
}

const AiMove = (isHint=false)=>{
  if(!isHint && room.playingGame.isRedTurn ? !room.isRedAI : !room.isBlackAI) return  
  const aiMove = bestMove(room.AILevel,room.playingGame.isRedTurn,boardMethod.value.getBoard())
  handleMove(aiMove)
}


const handleCheckMate = ()=>{
  room.isPlaying = false;
  ableClick.value = false
}

onMounted(()=>{
  InitNewGame()
})
</script>

<style scoped>
</style>

