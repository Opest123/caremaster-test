import {createRouter, createWebHistory} from "vue-router";
import {basePath} from "@/src/utils/settings";

import {useAuthStore} from "../stores/auth";

export const constantRoutes = [
    {
        path: `/`,
        hidden: true,
        redirect: to => {
            return {name: 'dashboard'}
        },
    },
    {
        name: "login",
        path: "/login",
        component: () => import("@/src/views/auth/Login.vue"),
        meta: {
            middleware: "guest",
            title: `Login`,
            requiresAuth: false
        }
    },
    {
        path: `${basePath}/dashboard`,
        component: () => import("@/src/views/layout/Index.vue"),
        meta: {
            middleware: 'auth',
            requiresAuth: true
        },
        children: [
            {
                name: "dashboard",
                path: '',
                component: () => import("@/src/views/dashboard/Index.vue"),
                meta: {
                    title: `Dashboard`,
                    requiresAuth: true
                },
            },
            {
                name: "companies",
                path: '/companies',
                component: () => import("@/src/views/component/Companies.vue"),
                meta: {
                    title: `Companies`,
                    requiresAuth: true
                }
            },
            {
                name: "employees",
                path: '/employees',
                component: () => import("@/src/views/component/Employees.vue"),
                meta: {
                    title: `Employees`,
                    requiresAuth: true
                }
            }
        ]
    },
    {
        // path: "*",
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () => import("@/src/views/component/errors/NotFound.vue")
    }
];

const createCustomRouter = () =>
    createRouter({
        history: createWebHistory(),
        scrollBehavior(to, from, savedPosition) {
            return {top: 0}
        },
        routes: constantRoutes,
    });


const router = createCustomRouter()

export function resetRouter() {
    const newRouter = createCustomRouter();
    router.matcher = newRouter.matcher; // reset router
}

router.beforeEach((to, from, next) => {
    document.title = to.meta.title

    const authStore = useAuthStore()

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
