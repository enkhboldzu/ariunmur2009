import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import VocabPage from '../pages/VocabPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/vocab', component: VocabPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
