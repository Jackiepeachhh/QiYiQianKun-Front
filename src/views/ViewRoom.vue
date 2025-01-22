<template>

    <div class="container">
      <online-player :isRed="true" :myState="room.redPlayer" :enemyState="room.blackPlayer"></online-player>
      <chess-board ref="boardMethod" 
      :ableClick="ableClick" 
      :isRedTurn="room.playingGame.isRedTurn">
      </chess-board>
      <button-bars :buttons="buttons"></button-bars>
      <my-menu v-if="showMenu" :menus="menus"></my-menu>
    </div>

</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {  showFailToast, showSuccessToast } from 'vant';
import myMenu from '../components/myMenu.vue';
import ChessBoard from '../components/chessBoard.vue';
import ButtonBars from '../components/buttonBars.vue';
import quitIcon from '@/assets/icon/quit.png';
import chessIcon from '@/assets/icon/chess.png'
import turnIcon from '@/assets/icon/turn.png'
import { sendMessage, subscribeTopic, unsubscribeAll, unsubscribeTopic } from '../services/stomp';
import { getRoom } from '../services/room';
import onlinePlayer from '../components/onlinePlayer.vue';
const route = useRoute();
const router = useRouter();
const boardMethod = ref()
const ableClick = ref(false)
const room = reactive({
  roomId: route.params.roomId,
  redPlayer: null,
  blackPlayer: null,
  isPlaying: false,
  playingGame: {
    isRedTurn: true,
    moves: [],
  }
});

const buttons = [[{ text: '菜单', func: () => { showMenu.value = !showMenu.value } }]]

const REQ_OR_RESP = {
  PEACE: 1,
  UNMOVE: 2,
}

const showMenu = ref(false)
const menus = [
  {
    label: '翻转棋盘', icon: turnIcon, func: () => {
      boardMethod.value.changeTurnOver()
      showMenu.value = false
    }
  },
  {
    label: '翻转棋子', icon: chessIcon, func: () => {
      boardMethod.value.changeTurnChess()
      showMenu.value = false
    }
  },
  {
    label: '退房', icon: quitIcon, func: () => {
        router.go(-1);
    }
  },
]
// websocket相关
const sendJoinMsg = () => {
  sendMessage(`/app/${room.roomId}/view`, { isJoin : true});
};

const sendLeaveMsg = () => {
  sendMessage(`/app/${room.roomId}/view`, { isJoin: false });
};

const handleMoveMsg = (moveMessage) => {
  room.playingGame.moves.push(moveMessage)
  boardMethod.value.doOrundoOneMove(moveMessage, true)
  room.playingGame.isRedTurn = !room.playingGame.isRedTurn
}

const handleUnMoveMsg = () => {
  room.playingGame.moves.pop();
  const lastMove = room.playingGame.moves.length - 1 >= 0 ? room.playingGame.moves[room.playingGame.moves.length - 1] : null;
  boardMethod.value.doOrundoOneMove(lastMove, false);
  room.playingGame.isRedTurn = !room.playingGame.isRedTurn
}

const handleGameOverMsg = (gameOverMessage) => {
  unsubscribeTopic(`/room/${room.roomId}/move`);
  unsubscribeTopic(`/room/${room.roomId}/un-move`);
  unsubscribeTopic(`/room/${room.roomId}/game-over`);
  room.isPlaying = false;
  showSuccessToast(gameOverMessage.reason);
}

const fetchViewRoom = async () => {
  const data = await getRoom(room.roomId);
  console.log(data)
  room.isPlaying = data.isPlaying
  room.redPlayer = data.redPlayer
  room.blackPlayer = data.blackPlayer
  room.playingGame.moves = data.playingGame.moves.map(move => {
    return {
    from:{ x:move.fromX , y:move.fromY},
    to:{ x:move.toX,y:move.toY},
    movePiece:move.movePiece,
    eatPiece:move.eatPiece,
  }})
  room.playingGame.isRedTurn = data.playingGame.isRedTurn
  const initBoard = data.playingGame.board.map(row => 
    row.map(piece => piece ? piece.name : null)
  );
  const move = room.playingGame.moves.length ? room.playingGame.moves[room.playingGame.moves.length-1] : null
  boardMethod.value.initBoard(initBoard,move);
}

onMounted(async () => {
  sendJoinMsg()
  await fetchViewRoom()
  if (!room.isPlaying) {
    showFailToast("对局已结束！");
    router.go(-1)
    return;
  }
  subscribeTopic(`/room/${room.roomId}/move`, handleMoveMsg);
  subscribeTopic(`/room/${room.roomId}/un-move`, handleUnMoveMsg);
  subscribeTopic(`/room/${room.roomId}/game-over`, handleGameOverMsg);
});

onUnmounted(() => {
  sendLeaveMsg();
  unsubscribeAll();
});

</script>

<style scoped>
.chess-board {
  position: relative;
}

.photo {
  position: absolute;
  width: 30vh;
  transform: translate(-50%, -50%);
  /* 将中心点对齐 */
  border-radius: 10%;
}

.top-photo {
  top: 30%;
  /* 纵向居中 */
  left: 50%;
  /* 水平居左，距离中心一定距离 */
}

.bottom-photo {
  top: 70%;
  /* 纵向居中 */
  left: 50%;
  /* 水平居右，距离中心一定距离 */
}

.ready-button {
  padding: 1vh 1vh;
  position: absolute;
  top: 90%;
  /* 垂直居中 */
  left: 50%;
  /* 水平居中 */
  transform: translate(-50%, -50%);
  /* 将按钮的中心对齐到父容器中心 */
  font-size: 4vh;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>