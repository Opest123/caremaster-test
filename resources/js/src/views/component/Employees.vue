<template>
    <div>
        <div class="flex my-5 space-x-4">
            <el-input clearable class="rounded fin-w-1/2" v-model="search" id="search" placeholder="Search..."/>

            <el-button type="primary" @click="createModal">
                Create
            </el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="first_name" label="First Name"/>
            <el-table-column prop="last_name" label="Last Name"/>
            <el-table-column prop="company_id" label="Company">
                <template #default="scope">
                    <span class="capitalize">
                        {{ scope.row.company ? scope.row.company.name : '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="email" label="Email"/>
            <el-table-column prop="phone" label="Phone"/>
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
            v-model:page-size="employees.meta.per_page"
            v-model:current-page="employees.meta.current_page"
            @size-change="getEmployees"
            @current-change="getEmployees"
            :total="employees.meta.total"
        />

        <create-or-edit-employee :modalData="modalData"/>
    </div>
</template>

<script>
import Web from "../../utils/web";
import {Delete, Edit} from "@element-plus/icons-vue";
import CreateOrEditEmployee from "./modal/CreateOrEditEmployee.vue";
import {storeToRefs} from "pinia"
import {useEmployeeStore} from "../../stores/employeeModal";

const employeeStore = useEmployeeStore()
const {modal} = storeToRefs(employeeStore);

export default {
    name: 'Employees',
    components: {
        CreateOrEditEmployee,
        Edit,
        Delete
    },
    props: [],
    data() {
        return {
            employees: [],
            page: 1,
            createOrEditModal: false,
            modalData: {},
            search: '',
            searchTimeout: 1000
        }
    },
    computed: {
        tableData() {
            const {data} = this.employees

            return data
        }
    },
    watch: {
        'search': {
            handler(val) {
                if (this.searchTimeout) clearTimeout(this.searchTimeout)
                this.searchTimeout = setTimeout(() => {
                    this.getEmployees()
                }, this.searchTimeout)
            },
            deep: true
        }
    },
    mounted() {
        this.getEmployees()

        this.emitter.on('reload', () => {
            this.getEmployees()
        })
    },
    methods: {
        getEmployees() {
            Web.get('api/employees', {
                params: {
                    page: _.get(this.employees, 'meta.current_page', 1),
                    per_page: _.get(this.employees, 'meta.per_page', 10),
                    search: this.search
                }
            }).then((res) => {
                this.employees = res.data
            }).catch(err => {
                console.log('error', err)
            })
        },
        destroy(row) {
            Web.delete(`api/employees/${_.get(row, 'id')}`).then((res) => {
                this.getEmployees()
            }).catch(err => {
                console.log('error', err)
            })
        },
        editModal(row) {
            employeeStore.setModal(true)
            employeeStore.modalTitle = 'Edit'
            this.modalData.title = 'Edit'
            this.modalData.data = row
        },
        createModal() {
            employeeStore.setModal(true)
            employeeStore.modalTitle = 'Create'
            this.modalData.title = 'Create'
        }
    }
}
</script>
