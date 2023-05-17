<template>
    <div>
        <div class="flex my-5 space-x-4">
            <el-input clearable class="rounded fin-w-1/2" v-model="search" id="search" placeholder="Search..."/>

            <el-button type="primary" @click="createModal">
                Create
            </el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="Name"/>
            <el-table-column prop="email" label="Email"/>
            <el-table-column label="Logo">
                <template #default="scope">
                    <el-avatar shape="square" :size="50" :src="scope.row.logo"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="website" label="Website">
                <template #default="scope">
                    <el-link :href="scope.row.website" target="_blank">{{ scope.row.website }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="Action">
                <template #default="scope">
                    <div class="flex space-x-6">
                        <el-button @click="destroy(scope.row)" type="danger">
                            <el-icon>
                                <Delete/>
                            </el-icon>
                        </el-button>

                        <el-button @click="editModal(scope.row)" type="primary">
                            <el-icon>
                                <Edit/>
                            </el-icon>
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            class="mt-2"
            v-if="tableData"
            background layout="total, sizes, prev, pager, next, jumper"
            v-model:page-size="companies.meta.per_page"
            v-model:current-page="companies.meta.current_page"
            @size-change="getCompanies"
            @current-change="getCompanies"
            :total="companies.meta.total"
        />

        <create-or-edit-company :modalData="modalData"/>
    </div>
</template>

<script>
import Web from "../../utils/web";
import {Delete, Edit} from "@element-plus/icons-vue";
import CreateOrEditCompany from "./modal/CreateOrEditCompany.vue";
import {useCompanyStore} from "../../stores/companyModal";
import {storeToRefs} from "pinia"

const companyStore = useCompanyStore()
const {modal} = storeToRefs(companyStore);

export default {
    name: 'Companies',
    components: {
        CreateOrEditCompany,
        Edit,
        Delete
    },
    props: [],
    data() {
        return {
            companies: [],
            page: 1,
            createOrEditModal: false,
            modalData: {},
            search: '',
            searchTimeout: 1000
        }
    },
    computed: {
        tableData() {
            const {data} = this.companies

            return data
        }
    },
    watch: {
        'search': {
            handler(val) {
                if (this.searchTimeout) clearTimeout(this.searchTimeout)
                this.searchTimeout = setTimeout(() => {
                    this.getCompanies()
                }, this.searchTimeout)
            },
            deep: true
        }
    },
    mounted() {
        this.getCompanies()

        this.emitter.on('reload', () => {
            this.getCompanies()
        })
    },
    methods: {
        getCompanies() {
            Web.get('api/companies', {
                params: {
                    page: _.get(this.companies, 'meta.current_page', 1),
                    per_page: _.get(this.companies, 'meta.per_page', 10),
                    search: this.search
                }
            }).then((res) => {
                this.companies = res.data
            }).catch(err => {
                console.log('error', err)
            })
        },
        destroy(row) {
            Web.delete(`api/companies/${_.get(row, 'id')}`).then((res) => {
                this.getCompanies()
            }).catch(err => {
                console.log('error', err)
            })
        },
        editModal(row) {
            companyStore.setModal(true)
            companyStore.modalTitle = 'Edit'
            this.modalData.title = 'Edit'
            this.modalData.data = row
        },
        createModal() {
            companyStore.setModal(true)
            companyStore.modalTitle = 'Create'
            this.modalData.title = 'Create'
        }
    }
}
</script>
