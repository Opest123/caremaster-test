import './bootstrap';
import '../css/app.css'

import {createApp} from "vue";
import {createPinia} from 'pinia'
import {createPersistedState} from 'pinia-plugin-persistedstate'
import SecureLS from "secure-ls";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from "./src/App.vue";
import router from "./src/router";
import Web from "./src/utils/web";
import {useAuthStore} from "./src/stores/auth";

var ls = new SecureLS({
    encodingType: 'des',
    isCompression: false,
    encryptionSecret: 'base64:GQQrB1Mb0amDixcoqBPuIGrk8XyOc90JsEM/03N8IeE='
});

const app = createApp(App)
const pinia = createPinia()

pinia.use(createPersistedState({
    storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
    }
}))

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.config.globalProperties.$web = window.web = Web

app.mount('#app')
