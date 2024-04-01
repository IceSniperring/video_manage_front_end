import {defineStore} from "pinia";

//用于在组件中图片信息的传递
export const usePostUploadFile = defineStore('postUploadFile', {
    state() {
        return {
            postFile: null
        }
    }
})