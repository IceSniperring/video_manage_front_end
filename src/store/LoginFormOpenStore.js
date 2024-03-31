import {defineStore} from "pinia";

//用于在用户未登录时打开登陆弹窗
export const useLoginFormOpen = defineStore('LoginFormOpen', {
    state() {
        return {
            dialogFormVisible: false,
            manualClose: false
        }
    }
})