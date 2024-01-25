import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import Top from './views/Top.vue'
import Report from './views/Report.vue'
import Contact from './views/Contact.vue'
import Exam from './views/Exam.vue'
import Detail from './views/Detail.vue'
import Setting from './views/Setting.vue'
import About from './views/About.vue'
import Test from './views/Test.vue'

import LangJa from './langs/ja'

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
		path: '/contact',
		component: Contact
	},
	{
		path: '/exam',
		component: Exam
	},
	{
		path: '/detail',
		component: Detail
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

const i18n = createI18n({
	legacy: false,
	locale: 'ja',
	messages: {
		ja: LangJa
	}
})

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

const vuetify = createVuetify({
	components,
	directives,
	icons: {
		defaultSet: 'mdi',
	}
})

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(pinia)
app.use(vuetify)
app.mount('#app')
