<template>
<van-button
    class="my-button"
    @click="func"
>
    <div class="my-button-content">
    <van-image 
        class="my-button-icon"
        :src="icon"
    />
    <span>{{ text }}</span>
    </div>
</van-button>
</template>

<script setup>
const props = defineProps({
  text:{
    type: String,
    required: true,
  },
  icon:{
    type:String,
    required:true,
  },
  func:{
    type: Function,
    required:true,
  }
})
</script>

<style scoped>
/* 响应式按钮的样式 */
.my-button {
  height: clamp(30px,10vw,50px);
  margin: 20px 0;
  font-size: clamp(24px,8vw,40px);
  background-color: rgba(255, 255, 255, 0.4); /* 半透明的背景色 */
  border-radius: 12px; /* 圆角 */
  border: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* 轻微的文字阴影 */
  display: flex;
  justify-content: center; /* 居中 */
  align-items: center; /* 垂直居中 */
  
}

/* 图片和文字的容器，使用 flex 布局 */
.my-button-content {
  display: flex;
  align-items: center; /* 确保图片和文字垂直居中 */
  justify-content: center;
}

/* 响应式图片 */
.my-button-icon {
  width: clamp(24px,8vw,40px); /* 使用 vh 让图片响应 */
  height: clamp(24px,8vw,40px); /* 保持宽高一致 */
  margin: 0 10px 0 0; /* 图片和文字之间的间距 */
}


</style>