import {createRouter, createWebHashHistory} from "vue-router";
import Home from "@/view/Home.vue";
import Player from "@/view/Player.vue";
import Upload from "@/view/Upload.vue";
import Search from "@/view/Search.vue";
import Kind from "@/view/Kind.vue";

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            redirect: "/home"
        },
        {
            path: "/home",
            component: () => Home
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
            path: '/upload',
            component: Upload
        },
        {
            name: 'search',
            path: '/search',
            component: Search
        }
    ]
})