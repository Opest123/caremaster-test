<template>
    <div class="container">
        Hi
        <el-button type="primary" @click="logout">
            Logout
        </el-button>
    </div>
</template>

<script>
import {useAuthStore} from "../../stores/auth";
import {mapState} from "pinia/dist/pinia";

const authStore = useAuthStore()

export default {
    name: 'dashboard',
    components: {},
    data() {
        return {}
    },
    computed: {
        ...mapState(useAuthStore, ['token'])
    },
    created() {
    },
    mounted() {
    },
    methods: {
        async logout() {
            await authStore.logout()
        },
    }
}
</script>
