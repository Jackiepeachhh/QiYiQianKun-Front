<template>
  <div class="overlay">
    <div class="button-container" v-for="(menu, index) in menus" :key="index" @click="menu.func">
      <van-image :src="menu.icon" alt="" class="button-icon" />
      <span class="button-label">{{ menu.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  menus: {
    type: Array,
    required: true
  }
});
const { menus } = toRefs(props);

</script>

<style scoped>
.overlay {
  position: fixed;
  display: flex;
  top: min(300px,35vh);
  width: min(600px,100vw);
  display: flex; /* 使用 flexbox */
  justify-content: center; /* 居中对齐 */
  background-color: rgba(0, 0, 0, 0.7); /* 黑色，70%透明 */
}

.button-container {
  display: flex; /* 使按钮内容纵向排列 */
  flex-direction: column; /* 纵向排列 */
  align-items: center; /* 水平居中对齐 */
  margin: min(50px,12vw) min(20px,2vw); /* 按钮间距 */
  cursor: pointer; /* 鼠标悬停时变为手指形状 */
  font-size: clamp(16px,5vw,24px);
}

.button-icon {
  width: min(60px,20vw); /* 调整图标的大小 */
  height: min(60px,15vw); /* 保持宽高一致 */
  margin-bottom: 10px; /* 图片和文字之间的间距 */
}

.button-label {
  color: white; /* 文字颜色为白色 */
}

</style>
