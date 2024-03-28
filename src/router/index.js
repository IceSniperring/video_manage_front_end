import {createRouter, createWebHashHistory} from "vue-router";
import Home from "@/view/Home.vue";
import Movie from "@/view/Movie.vue";
import Vue3 from "@/view/Vue3.vue";
import Animation from "@/view/Animation.vue";

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
            path: "/vue3Learn",
            component: Vue3
        },
        {
            path: "/movie",
            component: Movie
        },
        {
            path: "/animation",
            component: Animation
        }
    ]
})