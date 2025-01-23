import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Ai from '@/views/Ai.vue';
import Challenge from '@/views/Challenge.vue';
import Online from '@/views/Online.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Room from '@/views/Room.vue';
import ViewHall from '../views/ViewHall.vue';
import ViewRoom from '../views/ViewRoom.vue';
import ReviewHall from '../views/ReviewHall.vue';
import ReviewGame from '../views/ReviewGame.vue';
import {checkLoginStatus} from "@/services/user";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ai',
    name: 'Ai',
    component: Ai
  },
  {
    path: '/challenge',
    name: 'Challenge',
    component: Challenge
  },
  {
    path: '/online',
    name: 'Online',
    component: Online,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
   {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/room/:roomId',
    name: 'Room',
    component: Room,
    meta: { requiresAuth: true }
  },
  {
    path: '/view-hall',
    name: 'viewHall',
    component: ViewHall,
    meta: { requiresAuth: true }
  },
  {
    path: '/view/:roomId',
    name: 'ViewRoom',
    component: ViewRoom,
    meta: { requiresAuth: true }
  },
  {
    path: '/review-hall',
    name: 'ReviewHall',
    component: ReviewHall,
    meta: { requiresAuth: true }
  },
  {
    path: '/game/:gameId',
    name: 'ReviewGame',
    component: ReviewGame,
    meta: { requiresAuth: true }
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});


router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      await checkLoginStatus();
      next();
    } catch (error) {
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

export default router;