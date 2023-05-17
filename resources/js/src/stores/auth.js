import web from "../utils/web";
import router from "../router";
import {defineStore} from "pinia/dist/pinia";
import {Loading} from "element-plus/es/components/loading/src/service";

export const useAuthStore = defineStore({
    id: "authStore",
    state: () => ({
        token: null,
        user: null,
        loggedIn: false,
    }),
    getters: {
        getToken: (state) => {
            return state.token;
        },
        getUser: (state) => {
            return state.user;
        },
        getLoggedIn: (state) => {
            return state.loggedIn;
        },
    },
    actions: {
        async login(payload) {
            const loading = Loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })

            await web.get("sanctum/csrf-cookie");
            web.post("api/login", payload).then((res) => {
                setTimeout(() => {
                    loading.close();
                }, 1000);

                const {token, user} = res.data;

                this.token = token;
                this.user = user;
                this.loggedIn = true;

                router.push({name: "dashboard"});
            });
        },
        logout() {
            const loading = Loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })

            web.post("api/logout").then((res) => {
                this.user = null;
                this.loggedIn = false;

                localStorage.setItem("loggedIn", false);
                router.push({name: "login"});

                setTimeout(() => {
                    loading.close();
                }, 2000);
            });
        },
    },
    persist: {
        paths: ["token", "user", "loggedIn"],
    },
});
