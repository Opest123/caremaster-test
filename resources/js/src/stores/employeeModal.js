import {defineStore} from "pinia/dist/pinia";

export const useEmployeeStore = defineStore({
    id: "employeeModalStore",
    state: () => ({
        modal: false,
        modalTitle: ''
    }),
    getters: {
        getModal: (state) => {
            return state.modal;
        },
        getModalTitle: (state) => {
            return state.modalTitle;
        },
    },
    actions: {
        setModal(payload) {
            this.modal = payload
        },
        setModalTitle(payload) {
            this.modalTitle = payload
        },
    },
});
