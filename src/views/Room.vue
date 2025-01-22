<template>
  <div class="container">
    <online-player :isRed="room.isRed" :myState="room.myState" :enemyState="room.enemyState"></online-player>
    <chess-board ref="boardMethod" 
        :ableClick="ableClick" 
        :isRedTurn="room.playingGame.isRedTurn" 
        @move="sendMoveMsg" 
        @checkMate="sendCheckMateMsg">
      <div v-if="!room.isPlaying" >
        <img v-if="room.enemyState?.ready" src='@/assets/img/ready.png' alt="" class="photo top-photo" />
        <img v-if="room.myState?.ready" src='@/assets/img/ready.png' alt="" class="photo bottom-photo" />
        <button  v-if="room.myState?.ready" :style="{'background-color' : 'red'}" @click="sendCancelReadyMsg" class="ready-button">取  消</button>
        <button  v-else :style="{'background-color' : 'orange'}" @click="sendReadyMsg" class="ready-button">准  备</button>
      </div>
    </chess-board>
    <button-bars :buttons="buttons"></button-bars>
    <my-menu v-if="showMenu" :menus="menus"></my-menu>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive,onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant';
import myMenu from '../components/myMenu.vue';
import onlinePlayer from '../components/onlinePlayer.vue';
import ChessBoard from '../components/chessBoard.vue';
import ButtonBars from '../components/buttonBars.vue';
import undoIcon from '@/assets/icon/undo.png';
import quitIcon from '@/assets/icon/quit.png';
import handshakeIcon from '@/assets/icon/handshake.png';
import surrenderIcon from '@/assets/icon/surrender.png';
import { sendMessage, subscribeTopic, unsubscribeAll, unsubscribeTopic } from '../services/stomp';
import { getRoom } from '../services/room';
import { initBoard } from '../constants/clasli';

const route = useRoute();
const router = useRouter();
const boardMethod = ref()
const ableClick = ref(false)
const username = localStorage.getItem('UserName') || ''
const room = reactive({
  roomId: route.params.roomId,
  isRed: null,
  myState:null,
  enemyState:null,
  isPlaying: false,
  playingGame:{
    isRedTurn:true,  
    moves:[],
  }
});

const buttons=[[{text:'菜单',func:()=>{showMenu.value=!showMenu.value}}]]

const REQ_OR_RESP = {
  PEACE:1,
  UNMOVE:2,
}

const showMenu = ref(false)
const menus = [
  {label:'认输',icon:surrenderIcon,func:()=>{
      if(!room.isPlaying){
        showFailToast("当前对局尚未开始");
        return ;
      }
      showConfirmDialog({
          title: '警告',
          message:
            '确认要认输吗？',
        })
          .then(() => {
            sendDrawMsg()
            showMenu.value = false
          })
          .catch(() => {});
  }},
  {
    label:'求和',icon:handshakeIcon,func:()=>{
      if(!room.isPlaying){
        showFailToast("当前对局尚未开始");
        return ;
      }
       showConfirmDialog({
          title: '提示',
          message:
            '是否发出求和申请？',
        })
          .then(() => {
            sendRequestMsg(REQ_OR_RESP.PEACE);
            showMenu.value = false
          })
          .catch(() => {});  
    }
  },
  {
    label:'悔棋',icon:undoIcon,func:()=>{
      if(!room.isPlaying){
        showFailToast("当前对局尚未开始");
        return ;
      }
      if(room.isRed === room.playingGame.isRedTurn){
        showFailToast("当前轮到你下棋，无法悔棋");
        return ;
      }
      if(!room.playingGame.moves,length){
        showFailToast("您还没有移动过棋子，无法悔棋");
        return ;
      }
       showConfirmDialog({
          title: '提示',
          message:
            '是否发出悔棋申请',
        })
          .then(() => {
            sendRequestMsg(REQ_OR_RESP.UNMOVE);
            showMenu.value = false
          })
          .catch(() => {});
    }
  },
  {
    label:'退房',icon:quitIcon,func:()=>{
      if(room.isPlaying){
        showConfirmDialog({
          title: '确定要退出吗？',
          message:
            '当前正在对局中，执意退出房间将视为认输',
        })
          .then(() => {
            router.go(-1);
          })
          .catch(() => {});
      }else{
        router.go(-1);
      }
    }
  },
]

const handleRequestMsg = (requestMessage) => {
  if(requestMessage.receiver !== username) return ;
  switch (requestMessage.type) {
    case REQ_OR_RESP.PEACE:
      showConfirmDialog({
        title: '消息',
        message:
          '对方发出和棋申请，是否同意',
        confirmButtonText: '同意',
        cancelButtonText: '拒绝',
      })
        .then(() => {
          sendResponseMsg(REQ_OR_RESP.PEACE,true)
        })
        .catch(() => {
          sendResponseMsg(REQ_OR_RESP.PEACE,false)
        });
      break;
    case REQ_OR_RESP.UNMOVE:
      showConfirmDialog({
        title: '消息',
        message:
          '对方发出悔棋申请，是否同意',
        confirmButtonText: '同意',
        cancelButtonText: '拒绝',
      })
        .then(() => {
          sendResponseMsg(REQ_OR_RESP.UNMOVE,true)
        })
        .catch(() => {
          sendResponseMsg(REQ_OR_RESP.UNMOVE,false)
        });
      break;
  }
}

const handleResponseMsg = (responseMessage) => {
  if(responseMessage.receiver !== username) return ;
   switch (responseMessage.type) {
    case REQ_OR_RESP.PEACE:
      if(responseMessage.result) showSuccessToast("对方同意了你的和棋申请，游戏结束")
      else showFailToast("对方拒绝了你的和棋申请");
      break;
    case REQ_OR_RESP.UNMOVE:
      if(responseMessage.result){
        showSuccessToast("对方同意了你的悔棋申请");
      } 
      else showFailToast("对方拒绝了你的悔棋申请");
      break;
  }
}
const sendRequestMsg = (type)=>{
  sendMessage(`/app/${room.roomId}/request`,{
    type: type,
    sender:room.myState.username,
    receiver:room.enemyState.username,
  });
}

const sendResponseMsg = (type,result)=>{
  sendMessage(`/app/${room.roomId}/response`,{
    type: type,
    sender:room.myState.username,
    receiver:room.enemyState.username,
    result: result,
  });
}

const sendDrawMsg = ()=>{
  sendMessage(`/app/${room.roomId}/game-over`,{
    result: room.isRed?0:1,
    winner:room.enemyState.username,
    loser:room.myState.username,
    reason:`${room.isRed?'红方':'黑方'}认输`
  });
}

const sendCheckMateMsg = () => {
  if(room.isRedTurn) return ;
  sendMessage(`/app/${room.roomId}/game-over`,
    { result: room.isRed?1:0,
      winner:room.myState.username,
      loser:room.enemyState.username,
      reason:`${!room.isRedTurn?'红方':'黑方'}绝杀`,
  });
}

// websocket相关
const sendJoinMsg = () => {
  sendMessage(`/app/${room.roomId}/join`);
};
const handleJoinMsg = (joinMessage) => {
  if (username == joinMessage.player.username) {
    room.myState = joinMessage.player;
    room.isRed = joinMessage.isRed;
  } else {
    room.enemyState = joinMessage.player;
  }
};

const sendLeaveMsg = () => {
  sendMessage(`/app/${room.roomId}/leave`);
};

const handleLeaveMsg = (leaveMessage) => {
  console.log(leaveMessage)
  if (username === leaveMessage.player.username) {
    room.myState = null;
  } else{
    room.enemyState = null;
  }
};
// 准备
const sendReadyMsg = () => {
  sendMessage(`/app/${room.roomId}/ready`);
};
const handleReadyMsg = (readyMessage) => {
  if (room.isRed == readyMessage.isRed) {
    room.myState.ready = true;
  } else {
    room.enemyState.ready = true;
  }
};

// 取消准备
const sendCancelReadyMsg = () => {
  sendMessage(`/app/${room.roomId}/cancle-ready`);
};
const handleCancelReadyMsg = (cancelReadyMessage) => {
  if (room.isRed == cancelReadyMessage.isRed ) {
    room.myState.ready = false;
  } else {
    room.enemyState.ready = false;
  }
};

// 发送移动消息
const sendMoveMsg = (moveMessage) =>{
  sendMessage(`/app/${room.roomId}/move`,moveMessage);
}

const handleMoveMsg = (moveMessage) => {
  room.playingGame.moves.push(moveMessage)
  boardMethod.value.doOrundoOneMove(moveMessage,true)
  room.playingGame.isRedTurn = !room.playingGame.isRedTurn
  ableClick.value = room.isPlaying && room.playingGame.isRedTurn === room.isRed
}

const handleUnMoveMsg = () => {
  room.playingGame.moves.pop();
  const lastMove = room.playingGame.moves.length-1>=0 ? room.playingGame.moves[room.playingGame.moves.length-1] : null;
  boardMethod.value.doOrundoOneMove(lastMove,false);
  room.playingGame.isRedTurn = !room.playingGame.isRedTurn
  ableClick.value = room.isPlaying && room.playingGame.isRedTurn === room.isRed
}

const handleGameOverMsg = (gameOverMessage)=>{
  unsubscribeTopic(`/room/${room.roomId}/move`);
  unsubscribeTopic(`/room/${room.roomId}/un-move`);
  unsubscribeTopic(`/room/${room.roomId}/request`);
  unsubscribeTopic(`/room/${room.roomId}/response`);
  unsubscribeTopic(`/room/${room.roomId}/game-over`);
  room.isPlaying = false;
  ableClick.value = false;
  if(room.myState) room.myState.ready = false;
  if(room.enemyState) room.enemyState.ready = false;
  showSuccessToast(gameOverMessage.reason);  
}

const handleGameStartMsg = () => {
  showSuccessToast("对局开始！")
  subscribeTopic(`/room/${room.roomId}/move`, handleMoveMsg);
  subscribeTopic(`/room/${room.roomId}/un-move`, handleUnMoveMsg);
  subscribeTopic(`/room/${room.roomId}/request`, handleRequestMsg);
  subscribeTopic(`/room/${room.roomId}/response`, handleResponseMsg);
  subscribeTopic(`/room/${room.roomId}/game-over`, handleGameOverMsg);
  room.isPlaying = true;
  room.playingGame.moves = []
  room.playingGame.isRedTurn = true;
  ableClick.value = room.isPlaying && room.playingGame.isRedTurn === room.isRed;
  boardMethod.value.initBoard(initBoard);
  boardMethod.value.setTurnOver(room.isRed)
};

const fetchRoom = async ()=>{
  const data = await getRoom(room.roomId);
  const player = data.redPlayer || data.redPlayer
  room.enemyState = player;
}

onMounted(async () => {
  if(room.isPlaying){
    router.go(-1)
    return ;
  }
  // 订阅多个主题
  subscribeTopic(`/room/${room.roomId}/join`, handleJoinMsg);
  subscribeTopic(`/room/${room.roomId}/leave`, handleLeaveMsg);
  subscribeTopic(`/room/${room.roomId}/ready`, handleReadyMsg);
  subscribeTopic(`/room/${room.roomId}/candle-ready`, handleCancelReadyMsg);
  subscribeTopic(`/room/${room.roomId}/game-start`, handleGameStartMsg);
  await fetchRoom()
  sendJoinMsg()
  boardMethod.value.drawBackGround()
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
  transform: translate(-50%, -50%); /* 将中心点对齐 */
  border-radius: 10%;
}

.top-photo {
  top: 30%; /* 纵向居中 */
  left: 50%; /* 水平居左，距离中心一定距离 */
}

.bottom-photo {
  top: 70%; /* 纵向居中 */
  left: 50%; /* 水平居右，距离中心一定距离 */
}

.ready-button {
  padding: 1vh 1vh;
  position: absolute;
  top: 90%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 将按钮的中心对齐到父容器中心 */
  font-size: 4vh;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>