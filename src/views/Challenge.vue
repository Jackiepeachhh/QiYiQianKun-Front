<template>
<div class="container">
  <exit :type="2"></exit>
  <div v-show="isSelect" class="select-container"> 
    <h2>选择棋局</h2>
    <div class="select-board">
      <div
          v-for="(item, index) in clasli"
          :key="index"
          class="select-item"
          @click="select(item.board)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
  <div v-show="!isSelect">
      <chess-board ref="boardMethod" 
      :ableClick="ableClick" 
      :isRedTurn="room.playingGame.isRedTurn" 
      @move="handleMove" 
      @checkMate="handleCheckMate"></chess-board>
    <button-bars :buttons="buttons"></button-bars>
    <my-setting v-if="showCurrentSetting" :setings="cureentSetting" :value="room"></my-setting>
    <my-menu v-if="showMenu" :menus="menus"></my-menu>
  </div>
</div>
</template>

<script setup>
import { ref,reactive} from 'vue';
import exit from '../components/exit.vue';
import ChessBoard from '../components/chessBoard.vue';
import MySetting from '../components/mySetting.vue';
import MyMenu from '../components/myMenu.vue';
import ButtonBars from '../components/buttonBars.vue';
import chessIcon from '@/assets/icon/chess.png'
import turnIcon from '@/assets/icon/turn.png'
import { aiLevelOpts, playerOpts} from '../constants';
import { clasli } from '../constants/clasli';
import { bestMove } from '../utils/ai';

const boardMethod = ref()

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
  {text:'重开',func:()=>{ InitNewGame()}},
  {text:'设置',func:()=>{showCurrentSetting.value=true}},
  {text:'悔棋',func:()=>{undoMove()}},
],[
  {text:'菜单',func:()=>{showMenu.value=!showMenu.value}},
  {text:'提示',func:()=>{setTimeout(()=>AiMove(true),1000);}},
  {text:'返回',func:()=>{ isSelect.value=true}},
]]

const InitNewGame = ()=>{
  room.isPlaying = true
  room.playingGame.isRedTurn =true
  room.playingGame.moves = [];
  boardMethod.value.initBoard(selectBoard.value)
  ableClick.value = true
  if(room.playingGame.isRedTurn ? room.isRedAI : room.isBlackAI) setTimeout(AiMove,1000);
}

const showCurrentSetting = ref(false)
const cureentSetting = {
  title: '对局设置',
  options:[
  {label:'红方',type:'option',prop:'isRedAI' ,option:playerOpts},
  {label:'黑方',type:'option',prop:'isBlackAI' ,option:playerOpts},
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

const isSelect = ref(true);
const selectBoard = ref({});

const select = (board) => {
  selectBoard.value = board;
  isSelect.value = false;
  InitNewGame()
};


</script>

<style scoped>
.select-container{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.select-container h2{
  font-size: 50px;
  margin: 10px;
}
.select-board {
  width: 500px;
  height: 80%; /* 高度设置为60%视口高度 */
  background-color: rgba(0, 0, 0, 0.7); /* 半透明黑色背景 */
  display: flex;
  flex-direction: column; /* 按列排序 */
  overflow-y: auto; /* 允许纵向滚动 */
  padding: 10px; /* 内边距 */
}

.select-item {
  width: 100%; /* 项目宽度100% */
  padding: 10px; /* 内边距 */
  color: white; /* 字体颜色 */
  cursor: pointer; /* 鼠标悬停时显示手形光标 */
  text-align: center;
  font-size: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5); /* 分割线 */
}

.select-item:last-child {
  border-bottom: none; /* 最后一个项目不显示分割线 */
}
</style>
