<template>
    <div class="menu-bar">
      <div class="menu-row" v-for="(buttonBar,index1) in buttons" :key="index1">
        <button v-for="(btn,index2) in buttonBar" @click="btn.func" :key="index2">{{ btn.text }}</button>
      </div>
    </div>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  buttons: {
    type: Array,
    required: true
  }
})
const {buttons} = toRefs(props)
</script>

<style scoped>
.menu-bar {
  width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.menu-row {
  width: 350px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
.menu-bar button {
  padding: 10px 20px;
  font-size: 24px;
  background-color: #4682B4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.menu-bar button:hover {
  background-color: #4169E1;
}
</style>
