<template>
  <div class="my-form">
    <div class="my-form-content">
      <h2>{{title}}</h2>
      <div v-for="(item,index) in options" :key="index" class="form-group">
        <label>{{item.text}}</label>
        <input 
            v-model="data[item.prop]" 
            :type="item.type" 
            :placeholder="item.placeholder" 
            class="input-field"></input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { List } from 'vant';
import { toRefs } from 'vue';
const props = defineProps({
  title:{
    type:String,
    required:true
  },
  options:{
    required:true,
  },
  data:{
    required:true,
  },
})
const {title,options,data} = toRefs(props)
</script>

<style scoped>
.my-form{
    width: 100%;
    display: flex;
    justify-content: center;
}
.my-form-content {
  background-color: #fff;
  padding: 20px;
  width: 450px;
  border-radius: 12px;
}

.my-form-content h2{
  font-size: 36px;
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.form-group label {
  width: 150px;
  display: flex;
  justify-content: center;
  font-size: 20px;
}

.input-field {
  font-size: 20px;
  width: 400px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.8); /* 设置半透明背景 */
  color: #000; /* 设置输入文字颜色 */
}

.input-field::placeholder {
  font-size: 16px;
  color: #aaa; /* 设置占位符颜色 */
}

.input-field:focus {
    border-color:#000;
}
</style>
