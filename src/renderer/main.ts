import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

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

const vuetify = createVuetify({
	components,
	directives,
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi
		}
	}
})

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.mount('#app')
