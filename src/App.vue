<template>
  <div id="app" class="bg">
    <router-view></router-view>
  </div>
</template>

<script setup>

</script>

<style>
* {
  box-sizing: border-box; 
  margin: 0;
  /* 外边距 */
  padding: 0;
  /* 内边距 */
  border: 0;
  /* 边框 */
}
a{
  text-decoration: none;
}

.bg {
  height: 100vh;
  width: 100vw;
  background: url("@/assets/img/background.jpg") repeat center center fixed;
  display: flex;
  justify-content: center;
}

.container{
  position: relative;
  width: 600px;
  font-family: '楷体', sans-serif;
}
</style>