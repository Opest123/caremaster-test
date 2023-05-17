<template>
    <el-dialog v-model="isVisible" :title="modalData.title" width="70%" draggable>
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
            <el-form-item label="First Name:" prop="first_name">
                <el-input v-model="form.first_name"/>
            </el-form-item>
            <el-form-item label="Last Name:" prop="last_name">
                <el-input v-model="form.last_name"/>
            </el-form-item>
            <el-form-item label="Company:" prop="company_id">
                <el-select v-model="form.company_id" class="w-full" clearable placeholder="Select" size="large">
                    <el-option
                        v-for="item in companies"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="Email:" prop="email">
                <el-input v-model="form.email" type="email"/>
            </el-form-item>
            <el-form-item label="Phone:" prop="phone">
                <el-input v-model="form.phone"/>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeModal">Cancel</el-button>
                <el-button type="primary" @click="save">
                    Save
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import {storeToRefs} from "pinia/dist/pinia";
import Web from "../../../utils/web";
import {useEmployeeStore} from "../../../stores/employeeModal";

const employeeStore = useEmployeeStore()
const {modal, modalTitle} = storeToRefs(employeeStore);

export default {
    name: 'CreateOrEditEmployee',
    props: [
        'modalData'
    ],
    data() {
        return {
            isVisible: modal,
            form: {},
            rules: {
                first_name: [{required: true, message: "First Name is required"}],
                last_name: [{required: true, message: "Last Name is required"}],
                company_id: [{required: true, message: "Company is required"}],
                email: [{required: true, message: "Email is required"}],
            },
            companies: []
        }
    },
    computed: {
        title() {
            return modalTitle
        }
    },
    watch: {
        'modalData.data': {
            handler(val) {
                if (val) {
                    this.form = val
                }
            },
            deep: true
        },
        'modal': {
            handler(val) {
                this.isVisible = val
            },
            deep: true
        },
        'isVisible': {
            handler(val) {
                if (!val) {
                    employeeStore.setModal(val)
                    employeeStore.setModalTitle('')
                }
            },
            deep: true
        },
    },
    mounted() {
        this.getCompanies()
    },
    methods: {
        closeModal() {
            this.isVisible = false
            employeeStore.setModal(false)
            employeeStore.setModalTitle('')
            this.form = {}
            this.emitter.emit('reload')
        },
        fileChanged(e) {
            const target = e.target
            if (target && target.files) {
                this.form.logo = target.files[0];
            }
        },
        save() {
            this.$refs.form.validate(async (valid, errors) => {
                    if (valid) {
                        if (this.modalData.title === 'Edit') {
                            Web.post(`api/employees/${this.modalData.data.id}`, this.form, {
                                params: {
                                    _method: "put",
                                },
                            }).then((res) => {
                                console.log('save ', res)
                                this.closeModal()
                            }).catch(err => {
                                console.log('error', err)
                            })
                        } else {
                            Web.post(`api/employees`, this.form).then((res) => {
                                console.log('save ', res)
                                this.closeModal()
                            }).catch(err => {
                                console.log('error', err)
                            })
                        }
                    }
                }
            )
        },
        getCompanies() {
            Web.get('api/companies/getMinifiedCompanyList').then((res) => {
                this.companies = res.data
            }).catch(err => {
                console.log('error', err)
            })
        },
    }
}
</script>
