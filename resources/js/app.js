import '../css/app.css'
import './bootstrap';

import {createApp} from "vue";
import {createPinia} from 'pinia'
import {createPersistedState} from 'pinia-plugin-persistedstate'
import SecureLS from "secure-ls";
import mitt from 'mitt'

import App from "./src/App.vue";
import router from "./src/router";
import Web from "./src/utils/web";
import "./src/assets/main.scss"

var ls = new SecureLS({
    encodingType: 'des',
    isCompression: false,
    encryptionSecret: 'base64:GQQrB1Mb0amDixcoqBPuIGrk8XyOc90JsEM/03N8IeE='
});

const emitter = mitt()
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

app.config.globalProperties.$web = window.web = Web
app.config.globalProperties.emitter = emitter

app.config.unwrapInjectedRef = true
app.mount('#app')
