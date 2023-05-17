import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import Components from 'unplugin-vue-components/vite';
import IconsResolver from 'unplugin-icons/resolver'


export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/src/assets/main.css', 'resources/js/app.js'],
            refresh: true,
            valetTls: 'caremaster-test.test'
        }),
        vue(),
        AutoImport({
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/, // .md
            ],
            // global imports to register
            imports: [
                "vue",
                // custom
                {
                    "lodash": [
                        "get",
                        "has",
                        "isEmpty",
                        "size",
                        // alias
                        ["*", "_"], // import { useFetch as useMyFetch } from '@vueuse/core',
                    ],
                },
                {
                    "pinia": [
                        "defineStore",
                        "mapStores",
                        "mapState",
                        "mapActions",
                        "mapWritableState"
                    ],
                },
            ],
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    prefix: "icon"
                })
            ],
            vueTemplate: true,
        }),
        Components({
            resolvers: [ElementPlusResolver(), IconsResolver()],
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("resources/js", import.meta.url)),
        },
    },
});
