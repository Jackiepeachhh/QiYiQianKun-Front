<template>
    <div class="container">
      <exit :type="2"></exit>
      <Title></Title>
      <MyForm :title="'注册'" :data="userRegisterDto" :options="options"></MyForm>
      <div class="button-group">
        <MyButton :text="'去登录'" :func="handleLogin" :icon="loginIcon"></MyButton>
        <MyButton :text="'注册'" :func="handleRegister" :icon="registerIcon"></MyButton>
      </div>
    </div>

</template>

<script setup>
import Title from '../components/title.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { userRegister } from "@/services/user"; // 假设有一个 userRegister 服务
import md5 from 'js-md5';
import { showFailToast, showSuccessToast } from 'vant';
import MyButton from '../components/myButton.vue';
import exit from '../components/exit.vue';
import loginIcon from '@/assets/icon/login.png'
import registerIcon from '@/assets/icon/register.png'
import MyForm from '../components/MyForm.vue';
const router = useRouter();
const userRegisterDto = ref({
  username: '',
  password: '',
  confirmPassword: ''
});
const options = [
  {text:"用户名",prop:"username",type:"text",placeholder:"请输入用户名"},
  {text:"密 码",prop:"password",type:"password",placeholder:"请输入密码"},
  {text:"确认密码",prop:"confirmPassword",type:"password",placeholder:"请确认密码"},
]
const handleLogin = ()=>{
  router.push("/login")
}

const handleRegister = async () => {
  if (userRegisterDto.value.password !== userRegisterDto.value.confirmPassword) {
    showFailToast("两次输入的密码不一致！");
    return;
  }
  const param = {
    username: userRegisterDto.value.username,
    passwordMd5: md5(userRegisterDto.value.password)
  }
  const res = await userRegister(param);
  showSuccessToast("注册成功！");
  router.push({ name: 'Login' });
};
</script>

<style scoped>


.button-group {
  display: flex;
  justify-content: space-around; /* 在按钮之间留出空间 */
  margin-top:20px; /* 添加顶部间距 */
}

</style>
