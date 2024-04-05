import Element from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "@/assets/main.css"
import {createApp} from 'vue'
import App from './App.vue'
import {router} from "@/router/index.js";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from "pinia";
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.provide("serverUrl", "http://192.168.31.200:10001") //服务器地址
app.provide("videoSourceUrl", "http://192.168.31.200:10003") //视频资源地址
app.use(router)
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(Element)
app.use(createPinia())
app.mount('#app')
