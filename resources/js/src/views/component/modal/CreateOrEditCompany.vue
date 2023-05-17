<template>
    <el-dialog v-model="isVisible" :title="modalData.title" width="70%" draggable>
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
            <el-form-item label="Name:" prop="name">
                <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item label="Email:" prop="email">
                <el-input v-model="form.email" type="email"/>
            </el-form-item>
            <el-form-item label="Logo:" prop="logo">
                <input type="file" id="file" @change="fileChanged" accept="image/x-png,image/gif,image/jpeg"/>
            </el-form-item>
            <el-form-item label="Website:" prop="website">
                <el-input v-model="form.website"/>
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
import {useCompanyStore} from "../../../stores/companyModal";
import {storeToRefs} from "pinia/dist/pinia";
import Web from "../../../utils/web";

const companyStore = useCompanyStore()
const {modal, modalTitle} = storeToRefs(companyStore);

export default {
    name: 'CreateOrEditCompany',
    props: [
        'modalData'
    ],
    data() {
        return {
            isVisible: modal,
            form: {},
            rules: {
                name: [{required: true, message: "Name is required"}],
                email: [{required: true, message: "Email is required"}],
                logo: [{required: true, message: "Logo is required"}],
            }
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
                    console.log('isVisible ', val)
                    companyStore.setModal(val)
                    companyStore.setModalTitle('')
                }
            },
            deep: true
        },
    },
    methods: {
        closeModal() {
            this.isVisible = false
            companyStore.setModal(false)
            companyStore.setModalTitle('')
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
                        let formData = new FormData()
                        formData.append('name', this.form.name)
                        formData.append('email', this.form.email)
                        formData.append('logo', this.form.logo)
                        formData.append('website', _.get(this.form, 'website', ''))

                        if (this.modalData.title === 'Edit') {
                            Web.post(`api/companies/${this.modalData.data.id}`, formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
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
                            Web.post(`api/companies`, formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                }
                            }).then((res) => {
                                console.log('save ', res)
                                this.closeModal()
                            }).catch(err => {
                                console.log('error', err)
                            })
                        }
                    }
                }
            )
        }
    }
}
</script>
