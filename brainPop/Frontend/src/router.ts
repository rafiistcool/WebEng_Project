import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Card from '@/components/Card.vue';
import Desktop3 from "@/components/Desktop3.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/Card', component: Card },
  {path: '/desktop',component: Desktop3}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;