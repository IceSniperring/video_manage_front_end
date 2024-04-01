//用于通知组件更新分类列表
import {defineStore} from "pinia";

export const useKindListRefreshStore = defineStore("KindListRefresh", {
    state() {
        return {
            KindListRefresh: false
        }
    }
})