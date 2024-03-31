import Element from 'element-plus'
import 'element-plus/dist/index.css'
import {createApp} from 'vue'
import App from './App.vue'
import {router} from "@/router/index.js";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from "pinia";
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.provide("serverUrl", "http://127.0.0.1:8080")

app.use(router)
app.use(Element)
app.use(createPinia())
app.mount('#app')
