import BrowseCameras from '@/views/BrowseCameras.vue'
import EditDefaultConfig from '@/views/EditDefaultConfig.vue'
import EditJSON from '@/views/EditJSON.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Управление', component: BrowseCameras },
  { path: '/edit', name: 'Редактирование', component: EditDefaultConfig },
  { path: '/config', name: 'JSON Конфиг', component: EditJSON },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
