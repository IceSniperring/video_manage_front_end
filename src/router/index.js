import {createRouter, createWebHashHistory} from "vue-router";
import Home from "@/view/Home.vue";
import Player from "@/view/Player.vue";
import Upload from "@/view/Upload.vue";
import Search from "@/view/Search.vue";
import Kind from "@/view/Kind.vue";
import VideoManage from "@/view/VideoManage.vue";
import Page404 from '@/view/404.vue'
import ErrorPage from "@/view/ErrorPage.vue";
import History from "@/view/History.vue";

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            redirect: "home"
        },
        {
            name: "home",
            path: "/home",
            component: Home
        },
        {
            name: "kind",
            path: "/kind",
            component: Kind
        },
        {
            name: 'player',
            path: "/player",
            component: Player
        },
        {
            name: "upload",
            path: '/upload',
            component: Upload
        },
        {
            name: 'search',
            path: '/search',
            component: Search
        },
        {
            name: "videoManage",
            path: "/videoManage",
            component: VideoManage
        },
        {
            name: "history",
            path: "/history",
            component: History
        },
        {
            name: "error",
            path: "/error",
            component: ErrorPage
        },
        {
            name: "404",
            path: "/404",
            component: Page404
        },
        {
            path: "/:catchAll(.*)",
            redirect: "/404"
        }
    ]
})