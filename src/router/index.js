import {createRouter, createWebHashHistory} from "vue-router";
import Home from "@/view/Home.vue";
import Movie from "@/view/Game.vue";
import Vue3 from "@/view/Vue3.vue";
import Animation from "@/view/Animation.vue";
import Player from "@/view/Player.vue";
import Upload from "@/view/Upload.vue";
import Search from "@/view/Search.vue";
import Game from "@/view/Game.vue";

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            redirect: "/home"
        },
        {
            path: "/home",
            component: Home
        },
        {
            name: "vue3Learn",
            path: "/vue3Learn",
            component: Vue3,
        },
        {
            name: "game",
            path: "/game",
            component: Game,
        },
        {
            name: "animation",
            path: "/animation",
            component: Animation,
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