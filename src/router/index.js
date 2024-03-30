import {createRouter, createWebHashHistory} from "vue-router";
import Home from "@/view/Home.vue";
import Movie from "@/view/Movie.vue";
import Vue3 from "@/view/Vue3.vue";
import Animation from "@/view/Animation.vue";
import Player from "@/view/Player.vue";
import Upload from "@/view/Upload.vue";
import Search from "@/view/Search.vue";

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
            query: {
                page: 1
            }
        },
        {
            path: "/movie",
            component: Movie
        },
        {
            path: "/animation",
            component: Animation
        },
        {
            name: 'player',
            path: "/player",
            component: Player,
            props: true
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