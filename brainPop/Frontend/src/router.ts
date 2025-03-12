import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';

import Card from '@/components/LearningMode.vue';
import StartScreen from "@/components/StartScreen.vue";
import Login from './components/LoginPage.vue';
import Register from './components/RegisterPage.vue';
import Explorer from "@/components/Explorer/Explorer_main.vue";
import CardCreation from "@/components/CardCreation.vue";


const routes = [
  { path: '/', component: StartScreen },
  { path: '/card', component: Card, meta: { requiresAuth: true } } ,
  { path: '/startscreen', component: StartScreen} ,
  { path: '/login', component: Login},
  { path: '/register', component: Register},
  {path: '/explorer',component: Explorer, meta: { requiresAuth: true }},
  {path: '/cardcreation', component: CardCreation, meta: { requiresAuth: true }}


];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Navigation Guard für geschützte Routen
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userEmail') !== null; // Prüft, ob ein Nutzer eingeloggt ist

  if (to.meta.requiresAuth && !isAuthenticated) {
    alert('Du musst dich zuerst anmelden!');
    next('/login'); // Weiterleitung zum Login, falls nicht eingeloggt
  } else {
    next();
  }
});

export default router;