<script setup>
import {onBeforeRouteLeave, useRouter} from "vue-router";
import Player from 'xgplayer';
import {Util} from 'xgplayer'
import 'xgplayer/dist/index.min.css'
import {onMounted, onUnmounted, ref} from "vue";
import Plyr from "plyr"
import 'plyr/dist/plyr.css'

const route = useRouter()
let player = null
onMounted(() => {
  player = new Plyr("#player")
})

onBeforeRouteLeave((to, from, next) => {
  player.destroy(true)
  next();
})
</script>

<template>
  <h2>Vue3尚硅谷{{ route.currentRoute.value.query.id }}</h2>
  <!--  <div id="player"></div>-->
  <video id="player" playsinline controls data-poster="/path/to/poster.jpg">
    <source :src="`/src/assets/vue_video/Vue3尚硅谷 (${route.currentRoute.value.query.id}).mp4`" type="video/mp4"/>
  </video>
</template>

<style scoped>
#player {
  border-radius: 5px;
  overflow: hidden;
}
</style>