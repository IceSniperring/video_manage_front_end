import Element from 'element-plus'
import 'element-plus/dist/index.css'

import {createApp} from 'vue'
import App from './App.vue'
import {router} from "@/router/index.js";

createApp(App).use(router).use(Element).mount('#app')
