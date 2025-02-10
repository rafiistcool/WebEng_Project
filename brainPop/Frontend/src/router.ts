import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Card from '@/components/LearningMode.vue';
import StartScreen from "@/components/StartScreen.vue";


const routes = [
  { path: '/', component: Home },
  { path: '/card', component: Card } ,
  { path: '/startscreen', component: StartScreen}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;