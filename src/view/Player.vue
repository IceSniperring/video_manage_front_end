<script setup>
import {onBeforeRouteLeave, useRouter} from "vue-router";
import 'xgplayer/dist/index.min.css'
import {onMounted} from "vue";
import Plyr from "plyr"
import 'plyr/dist/plyr.css'

const route = useRouter()
let player = null
onMounted(() => {
	player = new Plyr("#player", {
		title: "sas",
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

onBeforeRouteLeave((to, from, next) => {
	//手动销毁实例
	player.destroy(true)
	next();
})
</script>

<template>
	<h2>Vue3尚硅谷{{ route.currentRoute.value.query.title }}</h2>
	<!--  <div id="player"></div>-->
	<div id="play-box">
		<video id="player" class="player"
		       playsinline controls data-poster="/path/to/poster.jpg"
		       style="--plyr-color-main: #3eae7d;--plyr-video-control-color-hover:#000000">
			<source :src="`/src/assets/vue_video/Vue3尚硅谷 (${route.currentRoute.value.query.title}).mp4`" type="video/mp4"/>
		</video>
	</div>
</template>

<style scoped>
#play-box {
	border-radius: 5px;
	overflow: hidden;
	width: 70%;
	box-shadow: 0 0 10px;
}
</style>