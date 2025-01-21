<template>
  <div class="game-card">
    <div class="info">
      <span v-if="viewNum !==null">观站人数: {{ viewNum }}</span>
      <span>回合: {{ stepNum }}</span>
    </div>
    <div class="players">
      <!-- 左侧玩家 -->
      <div class="left-player">
        <img :src="icons.leftIcon" alt="" class="icon-left" />
        <div class="player-info">
          <span>{{ left }}</span>
        </div>
      </div>

      <img :src="icons.centerIcon" alt="" class="icon-center" />

      <!-- 右侧玩家 -->
      <div class="right-player">
        <div class="player-info">
          <span>{{ right }}</span>
        </div>
        <img :src="icons.rightIcon" alt="" class="icon-right" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  viewNum: {
    type: Number,
    default: null
  },
  stepNum: {
    type: Number,
    Required:true
  },
  left: {
    type: String,
    Required:true
  },
  right:{
    type: String,
    Required:true
  },
  icons:{
    type: Object,
    required:true
  }

});

</script>

<style scoped>
.game-card {
  cursor: pointer;
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 12px;
  width: 450px;
  background-color: #CB985F;
}

.info {
  display: flex;
  justify-content: space-around;
  width: 100%;
  font-size: 20px;
  padding: 10px;
  background-color: #A07250;
}

.players {
  background-color: #C28D57;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-radius: 12px; /* 可选：圆角效果 */
  padding: 24px 0;
}

.left-player,
.right-player {
  width: 180px;
  flex: none; /* 不让player元素占据等宽，而是使用固定宽度 */
  display: flex;
  align-items: center;
  text-align: center;
}

.right-player{
  justify-content: flex-end; /* 子元素靠右 */
}


.icon-left {
  width: 60px;
  height: 60px;
  margin-left: 10px;
}
.icon-center {
  width: 70px;
  height: 70px;
}
.icon-right {
  width: 60px;
  height: 60px;
  margin-right: 0;
}


.player-info {
  width: 120px;
  text-align: center;
  font-size: 24px;
  color: #e0e0e0;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden;    /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 添加省略号 */
}


</style>
