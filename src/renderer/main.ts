import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import Top from './views/Top.vue'
import Report from './views/Report.vue'
import Setting from './views/Setting.vue'
import About from './views/About.vue'
import Test from './views/Test.vue'

const routes = [
	{
		path: '/',
		component: Top
	},
	{
		path: '/report',
		component: Report
	},
	{
		path: '/setting',
		component: Setting
	},
	{
		path: '/about',
		component: About
	},
	{
		path: '/test',
		component: Test
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
	}
})

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.mount('#app')
