import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import Top from './views/Top.vue'
import About from './views/About.vue'

const routes = [
	{
		path: '/',
		component: Top
	},
	{
		path: '/about',
		component: About
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

const app = createApp(App)

app.use(router)
app.mount('#app')
