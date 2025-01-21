import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css';
import { Button,Image as VanImage,Toast,Cell, CellGroup} from 'vant';

const app = createApp(App)
app.use(router)
app.use(Button).use(VanImage).use(Toast)
app.mount('#app')
