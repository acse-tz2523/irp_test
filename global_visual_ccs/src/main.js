//Author: Tianzi Zhang
//github: acse-tz2523
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from '../node_modules/element-plus';
import 'element-plus/dist/index.css';
import ecStat from 'echarts-stat';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router);
app.use(ElementPlus);
app.use(ecStat);
app.mount('#app');
