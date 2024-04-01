<template>
  <h2>{{ videoInfo.title }}</h2>
  <!--  <div id="player"></div>-->
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="18">
          <div id="play-box" v-if="videoInfo!==null">
            <video id="player" class="player"
                   playsinline
                   controls :data-poster="`${inject('serverUrl')}${videoInfo.postPath}`"
                   style="--plyr-color-main: #3eae7d;--plyr-video-control-color-hover:#000000">
              <source :src="`${inject('serverUrl')}${videoInfo.filePath}`" type="video/mp4"/>
            </video>
          </div>
        </el-col>
        <el-col :span="6">
          <el-row v-for="i in 2" align="middle">
            <el-col>
              <el-card class="box-card">
                <el-image src="http://127.0.0.1:8080/vue/image/01_为什么选择Vue框架.jpg"
                          alt="加载失败" :fit="'scale-down'"/>
                <p style="margin-left: 5px">{{ i }}</p>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script setup>
import {onBeforeRouteLeave, useRoute} from "vue-router";
import 'xgplayer/dist/index.min.css'
import {inject, onBeforeMount, onMounted, ref} from "vue";
import Plyr from "plyr"
import 'plyr/dist/plyr.css'
import axios from "axios";

const route = useRoute()
let player = null
let videoUrl = inject("serverUrl") + "/api/getVideoById"
let videoInfo = ref([])

onBeforeMount(async () => {
  await axios.get(videoUrl, {params: {id: route.query.id}}).then((response) => {
    videoInfo.value = response.data
    //数据获取成功之后渲染
    player = new Plyr("#player", {
      speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      },
      //快捷键
      keyboard: {
        focused: true,
        global: true,
      },
      //控件列表
      controls: [
        'play-large',
        'restart',
        //'rewind',
        'play',
        //'fast-forward',
        'progress',
        //'current-time',
        //'duration',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',
        'airplay',
        'download',
        'fullscreen',
      ],
      tooltips: {
        controls: true,
        seek: true,
      },
      //国际化
      i18n: {
        restart: '重新播放',
        play: '播放',
        pause: '暂停',
        seekLabel: '{currentTime} of {duration}',
        played: '正在播放',
        buffered: 'Buffered',
        currentTime: 'Current time',
        duration: 'Duration',
        volume: '音量',
        mute: '静音',
        unmute: '解除静音',
        enableCaptions: '开启翻译',
        disableCaptions: '关闭翻译',
        download: '下载',
        enterFullscreen: '全屏',
        exitFullscreen: '退出全屏',
        frameTitle: 'Player for {title}',
        captions: '翻译',
        settings: '设置',
        pip: '迷你播放器',
        menuBack: 'Go back to previous menu',
        speed: '速度',
        normal: '正常',
        quality: '质量',
        loop: '循环',
        start: '开始',
        end: '结束',
        all: 'All',
        reset: '重置',
        disabled: 'Disabled',
        enabled: 'Enabled',
        advertisement: 'Ad',
        qualityBadge: {
          2160: '4K',
          1440: 'HD',
          1080: 'HD',
          720: 'HD',
          576: 'SD',
          480: 'SD',
        },
      }
    })
  })
})

onMounted(() => {


})

onBeforeRouteLeave((to, from, next) => {
  //手动销毁实例
  player.destroy(true)
  next();
})
</script>
<style scoped>
#play-box {
  box-shadow: 0 0 10px;
}
</style>