import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';

import Card from '@/components/LearningMode.vue';
import StartScreen from "@/components/StartScreen.vue";
import Login from './components/LoginPage.vue';
import Register from './components/RegisterPage.vue';
import Desktop3 from "@/components/Desktop3.vue";

const routes = [
  { path: '/', component: StartScreen },
  { path: '/card', component: Card } ,
  { path: '/startscreen', component: StartScreen} ,
  { path: '/login', component: Login},
  { path: '/register', component: Register},
  {path: '/desktop',component: Desktop3}
    

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;