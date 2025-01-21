<template>
  <div class="container">
    <exit :type="2"></exit>
    <Title></Title>
    <MyForm :title="'登录'" :data="userLoginDto" :options="options"></MyForm>
    <div class="button-group">
      <MyButton :text="'去注册'" :func=handleRegister :icon="registerIcon" ></MyButton>
      <MyButton :text="'登录'" :func="handleLogin" :icon="loginIcon"></MyButton>
    </div>
  </div>
</template>

<script setup>
import Title from '../components/title.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { userLogin } from "@/services/user";
import md5 from 'js-md5';
import { showFailToast } from 'vant';
import MyButton from '../components/myButton.vue';
import exit from '../components/exit.vue';
import loginIcon from '@/assets/icon/login.png'
import registerIcon from '@/assets/icon/register.png'
import MyForm from '../components/MyForm.vue';
const router = useRouter();
const userLoginDto = ref({
  username: '',
  password: '',
});

const options = [
  {text:"用户名",prop:"username",type:"text",placeholder:"请输入用户名"},
  {text:"密 码",prop:"password",type:"password",placeholder:"请输入密码"},
]

const handleRegister = ()=>{
  router.push("/register")
}

const handleLogin = async () => {
  const param = {
    username: userLoginDto.value.username,
    passwordMd5: md5(userLoginDto.value.password)
  }
  const res = await userLogin(param);
  localStorage.setItem('Token', res.token);
  localStorage.setItem('UserName', res.username);
  router.push("/online");
};
</script>

<style scoped>

.button-group {
  display: flex;
  justify-content: space-around; /* 在按钮之间留出空间 */
  margin-top: 20px; /* 添加顶部间距 */
}
</style>
