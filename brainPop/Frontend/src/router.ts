import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/script/auth.ts';

import Card from '@/components/LearningMode.vue';
import StartScreen from "@/components/StartScreen.vue";
import Login from './components/LoginPage.vue';
import Register from './components/RegisterPage.vue';
import Explorer from "@/components/Explorer/Explorer_main.vue";
import CardCreation from "@/components/CardCreation.vue";


const routes = [
  { path: '/', component: StartScreen },
  { path: '/card', component: Card, meta: { requiresAuth: true }},
  { path: '/startscreen', component: StartScreen} ,
  { path: '/login', component: Login},
  { path: '/register', component: Register},
  { path: '/logout', component: StartScreen},
  { path: '/explorer',component: Explorer,  meta: { requiresAuth: true }},
  { path: '/cardcreation', component: CardCreation,  meta: { requiresAuth: true }},
  { path: '/home', component: Explorer,  meta: { requiresAuth: true }}


];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});



router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();


  if (!authStore.sessionChecked) {
    await authStore.checkSession();
  }

  if (to.meta.requiresAuth && !useAuthStore().isUserLoggedIn) {
    alert('Du musst dich zuerst anmelden!');
    next('/login');
  } else {
    next();
  }
});

export default router;
