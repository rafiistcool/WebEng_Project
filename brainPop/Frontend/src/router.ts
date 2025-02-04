import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Card from '@/components/Card.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/card', component: Card }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;