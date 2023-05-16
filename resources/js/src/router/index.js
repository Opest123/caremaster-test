import {createRouter, createWebHistory} from "vue-router";

import {useAuthStore} from "../stores/auth";

export const constantRoutes = [
    {
        name: "login",
        path: "/login",
        component: () => import("@/src/views/auth/Login.vue"),
        meta: {
            middleware: "guest",
            title: `Login`
        }
    },
    {
        path: `/`,
        component: () => import("@/src/views/dashboard/Index.vue"),
        meta: {
            middleware: 'auth'
        },
        children: [
            {
                name: "dashboard",
                path: '/',
                component: import("@/src/views/dashboard/Index.vue"),
                meta: {
                    title: `Dashboard`
                }
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title

    const authStore = useAuthStore()

    console.log('hi')

    if (to.meta.middleware == "guest") {
        if (authStore.loggedIn) {
            next({name: "dashboard"})
        }
        next()
    } else {
        if (authStore.loggedIn) {
            next()
        } else {
            next({name: "login"})
        }
    }
})

export default router
