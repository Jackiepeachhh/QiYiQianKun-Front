<template>
  <div class="modal">
    <div class="modal-content">
      <h2>{{setings.title}}</h2>

      <div v-for="(item,index) in setings.options" :key="index" class="form-group">
        <label :for="`select-${item.prop}`" >{{ item.label }}</label>
        <select :id="`select-${item.prop}`" v-model="value[item.prop]" class="form-group-select" >
          <option  v-for="opt in item.option" :value=opt.value>{{opt.label}}</option>
        </select>
      </div>

      <div class="btn-group">
        <button v-for="(btn,index) in setings.buttons" :key="index" @click="btn.func()">{{btn.label}}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {  toRefs } from 'vue';
const props = defineProps({
  setings:{
    type:Object,
    require:true
  },
  value:{
    type: Object,
    required: true,
  },
})
const {setings,value} = toRefs(props)
</script>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  top: 0;
  width: min(600px,100vw);
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  width: min(350px,100vw);
  border-radius: 12px;
}

.modal-content h2{
  font-size: clamp(16px,6vw,30px);
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-group label {
  width: min(150px,25vw);
  display: flex;
  justify-content: center;
  font-size: 24px;
}

.form-group-select {
  width: min(150px,25vw);
  padding: 10px 0 10px 40px;
  font-size: clamp(12px,4vw,20px);
  border-radius: 5px;
  border: 1px solid #ccc;
  
}


.btn-group {
  text-align: center;
}

.btn-group button {
  padding: 10px 20px;
  margin: 10px 15px;
  font-size: clamp(12px,4vw,20px);
  background-color: #4682B4;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.btn-group button:hover {
  background-color: #4169E1;
}


</style>
