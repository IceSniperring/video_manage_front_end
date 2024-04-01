<template>
  <h2>{{ videoInfo.title }}</h2>
  <!--  <div id="player"></div>-->
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="21">
          <div id="play-box">
            <video id="player" class="player"
                   playsinline
                   controls :data-poster="`${inject('serverUrl')}${videoInfo.postPath}`"
                   style="--plyr-color-main: #3eae7d;--plyr-video-control-color-hover:#000000">
              <source :src="playerSrc" type="video/mp4"/>
            </video>
          </div>
        </el-col>
        <el-col :span="3">
          <el-row>
            <h4>为你推荐</h4>
          </el-row>
          <el-row v-for="randomVideoInfo in random4Video" align="middle">
            <el-col>
              <router-link :to="{
                name:'player',
                query:{
                  id: randomVideoInfo.id
                }
              }">
                <el-card class="box-card">
                  <el-image :src="`${inject('serverUrl')}${randomVideoInfo.postPath}`"
                            alt="加载失败" :fit="'scale-down'"/>
                  <p style="margin-left: 5px" id="el-card-title">{{ randomVideoInfo.title }}</p>
                </el-card>
              </router-link>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script setup>
import {onBeforeRouteLeave, onBeforeRouteUpdate, useRoute} from "vue-router";
import 'xgplayer/dist/index.min.css'
import {inject, onBeforeMount, onMounted, ref} from "vue";
import Plyr from "plyr"
import 'plyr/dist/plyr.css'
import axios from "axios";
import {ElMessage} from "element-plus";

const route = useRoute()
let player = null
const serverUrl = inject("serverUrl")
let videoUrl = inject("serverUrl") + "/api/getVideoById"
let videoRandomUrl = inject("serverUrl") + "/api/getRandom4Video"
let videoInfo = ref([])
let random4Video = ref([])
const playerSrc = ref("")
const playerOption = {
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
}

onBeforeMount(async () => {
  await axios.get(videoUrl, {params: {id: route.query.id}}).then((response) => {
    videoInfo.value = response.data
    playerSrc.value = serverUrl + response.data.filePath
    //数据获取成功之后渲染
    player = new Plyr("#player", playerOption)
  }).catch(() => {
    //出现意外时的弹窗
    ElMessage({
      type: 'error',
      message: "获取数据失败",
      lockScroll: false
    })
  })
  await axios.get(videoRandomUrl).then((response) => {
    random4Video.value = response.data
  })
})

//路由更新，重新获取数据
onBeforeRouteUpdate(async (to, from) => {
  await axios.get(videoUrl, {params: {id: to.query.id}}).then((response) => {
    videoInfo.value = response.data
    playerSrc.value = serverUrl + response.data.filePath
    //更新播放源
    player.source = {
      type: 'video',
      sources: [{src: playerSrc.value, type: 'video/mp4'}],
    };
  }).catch(() => {
    //出现意外时的弹窗
    ElMessage({
      type: 'error',
      message: "获取数据失败",
      lockScroll: false
    })
  })
  await axios.get(videoRandomUrl).then((response) => {
    random4Video.value = response.data
  })
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

.el-col {
  margin: 15px 0;
}

.el-image {
  transition: .2s ease-in;
}

.el-image:hover {
  filter: brightness(60%);
}

.el-card {
  border-radius: 5px;
  --el-card-padding: 0px;
  border-width: 0;
}

.el-card:hover {
  box-shadow: 2px 4px 6px;
}

.box-card p {
  margin: 10px;
  width: 90%;
  overflow: hidden;
  display: -webkit-box;
  /*文字换行4次，此后省略*/
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  word-wrap: break-word;
}

#el-card-title {
  font-size: 50%;
}

a {
  text-decoration: none;
}
</style>