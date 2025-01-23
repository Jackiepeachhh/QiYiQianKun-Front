<template>
  <div class="exit-icon" @click="handleExit">
    <img src="@/assets/icon/exit.png" alt="Exit" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { showConfirmDialog } from 'vant';
const props = defineProps({
  type: {
    type: Number,
    default: 1
  }
});

const router = useRouter();

const handleExit = () => {
  switch (props.type) {
    case 1:
      router.go(-1);
      break;
    case 2:
      router.push('/');
      break;
    case 3:
      showConfirmDialog({
          message:
            '是否保留账户？',
        })
          .then(() => {
            router.push('/');
          })
          .catch(() => {
            localStorage.removeItem('Token');
            localStorage.removeItem('UserName');
            router.push('/');
          });
      
      break;
  }
};
</script>

<style scoped>
.exit-icon {
  position:absolute;
  left: 10px;
  top: 10px;
  cursor: pointer;
  z-index: 1000; /* 确保图标在最上层 */
}


.exit-icon img {
  width: min(12vw,50px); /* 图标的宽度 */
  height: min(12vw,50px); /* 图标的高度 */
 
}
</style>
