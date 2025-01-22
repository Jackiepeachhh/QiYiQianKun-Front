<!-- 该组件的功能是绘制棋盘，并且根据棋盘的点击情况向父组件反馈 -->
<template>
    <div class="chess-board">
      <canvas ref="canvas"  @click="clickCanvas" :width="stype.width" :height="stype.height" class="chess-canvas"></canvas>
      <slot></slot>
    </div>
</template>

<script setup>
import moveLaw, { doMove, getIsCheck, getIsCheckMate, undoMove } from '../utils/chess';
import { stype } from '../constants';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { createInitBoard, drawBg, drawBoard } from '../utils/board';
import { showFailToast, showSuccessToast } from 'vant';

const audioPaths = {
  move: new Audio(new URL('@/assets/audio/go.mp3', import.meta.url).href),
  eat: new Audio(new URL('@/assets/audio/eat.mp3', import.meta.url).href),
  check: new Audio(new URL('@/assets/audio/check.mp3', import.meta.url).href),
  defeat: new Audio(new URL('@/assets/audio/gamelose.mp3', import.meta.url).href),
  select: new Audio(new URL('@/assets/audio/select.wav', import.meta.url).href),
};


// 2. 创建播放音效的函数
const playSound = (sound) => {
  if (audioPaths[sound]) {
    audioPaths[sound].currentTime = 0; // 重置音频
    audioPaths[sound].play();
  }
};

const chessBoard = reactive({
  notTurnOver:true,
  notTurnChess:true,
  move:null,
  board: null,
  chosingPiecePos:null,
  ableMove: []
});

const canvas = ref();
var ctx;
const draw = ()=>{drawBoard(ctx,chessBoard);}

// 父对子
const props =  defineProps({
    // 当前用户能否点击
    ableClick:{
      type:Boolean,
      required:true
    },
    // 当前是否轮到红方
    isRedTurn:{
      type:Boolean,
      required:true
    }
})
const {ableClick,isRedTurn} = toRefs(props)


// 子通知父
const emit = defineEmits(['move','checkMate']);
var move = {}
const sendMove = ()=>{ 
  emit('move', move);
}

const sendCheckMate = ()=>{ 
  emit('checkMate');
}

// 子提供父接口
const doOrundoOneMove = (move,isDo)=>{
  // 清空选中
  chessBoard.chosingPiecePos = null
  chessBoard.ableMove = []
  // 修改棋盘为移动后
  if(isDo){
    doMove(move,chessBoard.board)
    if(move.eatPiece){
      playSound('eat')
    }else{
      playSound('move')
    }
  }else {
    undoMove(chessBoard.move,chessBoard.board)
    playSound('move')
  }
  // 记录当前移动
  chessBoard.move = move
  let isCheckMate = false
  if(isDo) isCheckMate = getIsCheckMate(chessBoard.board,isRedTurn.value)
  if(isCheckMate){
    showSuccessToast("绝杀！")
    sendCheckMate()
    playSound('defeat')
  }else{
    const isCheck = getIsCheck(chessBoard.board,isRedTurn.value)
    if(isCheck){ 
      showFailToast("将军！")
      playSound('check')
    }
  }
  draw()
}

const setTurnOver = (val)=>{ 
    chessBoard.notTurnOver = val
    draw()
}


const changeTurnOver = ()=>{ 
    chessBoard.notTurnOver = !chessBoard.notTurnOver
    draw()
}

const changeTurnChess = ()=>{ 
    chessBoard.notTurnChess = !chessBoard.notTurnChess
    draw()
}

const initBoard = (board,move=null)=>{
  // 清空选中
  chessBoard.chosingPiecePos = null
  chessBoard.ableMove = []
  // 清空移动
  chessBoard.move = move

  // 绘制初始格局
  chessBoard.board = createInitBoard(board)
  draw()
} 

const getBoard=()=>{
  return chessBoard.board
}

const drawBackGround=()=>{
  drawBg(ctx);
}

defineExpose({
  doOrundoOneMove,
  changeTurnOver,
  changeTurnChess,
  initBoard,
  getBoard,
  drawBackGround,
  setTurnOver,
})


// 获取点击的点
const getClickPoint = (event) => {
	const rect = canvas.value.getBoundingClientRect();
  const xProportion = stype.width / rect.width; // 实际 canvas 宽度
	const yProportion = stype.height / rect.height; // 实际 canvas 高度
	let x = Math.round(((event.clientX - rect.left)*xProportion -20) / stype.spaceX);
	let y = Math.round(((event.clientY - rect.top)*yProportion -20) / stype.spaceY);
  if (0 <= x && x <= 8 && 0 <= y && y <= 9) return { x:chessBoard.notTurnOver?x:8-x, y:chessBoard.notTurnOver?y:9-y };
	return null;
};

// 选中棋子
const choosePiece = (point) => {
  chessBoard.chosingPiecePos = point;
  const piece = chessBoard.board[point.y][point.x].name[0].toLowerCase();
  const getAbleMove = moveLaw[piece];
  chessBoard.ableMove = getAbleMove(point, chessBoard.board);

  move.from = point
  playSound('select')
};

// 判断能否移动棋子
const ableMove = (point) => {
	for (const dot of chessBoard.ableMove) {
		if (dot.y == point.y && dot.x == point.x) {
			return true;
		}
	}
	return false;
};
// 点击棋盘处理逻辑
const clickCanvas = (event) => {
  if(!ableClick.value) return
  const point = getClickPoint(event);
  if (point == null) return;
  if(ableMove(point)){
    
    move.to = point
    move.movePiece = chessBoard.board[move.from.y][move.from.x]
    move.eatPiece =  chessBoard.board[move.to.y][move.to.x]
    doMove(move,chessBoard.board)
    // 判断会不会送将
    const isGivenCheck = getIsCheck(chessBoard.board,!isRedTurn.value)
    undoMove(move,chessBoard.board)
    if(isGivenCheck){
      chessBoard.chosingPiecePos = null;
      chessBoard.ableMove = []
      showFailToast("不能送将！")
    }else{
      sendMove(move)
    }
    return ;
  }
  if (chessBoard.board[point.y][point.x]?.isRed === isRedTurn.value
    && point!==move.from){
     choosePiece(point);
  }else{
    chessBoard.chosingPiecePos = null;
    chessBoard.ableMove = []
  }
  draw()
}
onMounted(()=>{
  ctx = canvas.value.getContext('2d');
})
</script>

<style scoped>
.chess-board {
  display: flex;
  justify-content: center;
  margin: 120px 0 20px 0;
}

.chess-canvas {
  height: calc(100vh - 300px);
}
</style>
