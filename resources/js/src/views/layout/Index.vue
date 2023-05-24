<template>
    <div class="w-full h-full common-layout">
        <el-container>
            <el-header class="flex justify-between items-center p-5 bg-black text-white">
                <div>
                    <router-link :to="{name:'dashboard'}">{{ routeName }}</router-link>
                </div>

                <el-dropdown>
                <span class="el-dropdown-link uppercase">
                  {{ fullName }}
                  <el-icon class="el-icon--right">
                    <arrow-down/>
                  </el-icon>
                </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="logout">Logout</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>

            <el-main class="p-5">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="Companies" name="companies" class="w-full">
                    </el-tab-pane>

                    <el-tab-pane label="Employees" name="employees" class="w-full">
                    </el-tab-pane>
                </el-tabs>

                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import {useAuthStore} from "../../stores/auth";
import {mapState} from "pinia/dist/pinia";
import {ArrowDown} from '@element-plus/icons-vue'
import {useRoute} from 'vue-router'

export default {
    name: 'dashboard',
    setup() {
        const route = useRoute()

        const authStore = useAuthStore()

        return {
            authStore,
            route
        }
    },
    components: {
        ArrowDown,
    },
    data() {
        return {
            activeName: 'companies',
        }
    },
    computed: {
        ...mapState(useAuthStore, ['token']),
        routeName() {
            return this.$route.meta.title
        },
        fullName() {
            return _.get(this.authStore, 'user.full_name')
        }
    },
    created() {
    },
    mounted() {
        this.$router.push({name: this.activeName})
    },
    methods: {
        async logout() {
            await this.authStore.logout()
        },
        handleClick(tab, event) {
            this.$router.push({name: tab.props.name})
        },
    }
}
</script>


<style scoped>
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
</style>
