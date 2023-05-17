import {defineStore} from "pinia/dist/pinia";

export const useCompanyStore = defineStore({
    id: "companyModalStore",
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
            console.log('setModalTitle ', payload)
            this.modalTitle = payload
        },
    },
});
