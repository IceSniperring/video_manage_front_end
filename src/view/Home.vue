<template>
	<el-container>
		<el-header>
			<h1>🏡主页</h1>
		</el-header>
		<el-main>
			<el-row id="carousel">
				<el-col :span="24" v-if="windowWidth>=1000">
					<el-carousel :style="'height:'+windowHeight/2+'px'" type="card">
						<el-carousel-item v-for="postInfo in postInfoList" :key="postInfo.id" :label="postInfo.title" :style="'height:'+windowHeight/2+'px'">
							<router-link :to="{
								 name:'player',
                 query: {
                    id:postInfo.id
                }
							}">
								<el-image :src="`${inject('videoSourceUrl')}${postInfo.postPath}`"
								          alt="加载失败" style="width: 100%"  :style="'height:'+windowHeight/2+'px'" :fit="'cover'"/>
							</router-link>
						</el-carousel-item>
					</el-carousel>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col v-for="videoInfo in videoInfoList" :span="windowWidth<600?24:(windowWidth<1200?12:6)"
				        :key="videoInfo.id">
					<router-link :to="{
								 name:'player',
                 query: {
                    id:videoInfo.id
                }
							}">
						<el-card class="box-card">
							<el-image :src="`${inject('videoSourceUrl')}${videoInfo.postPath}`"
							          alt="加载失败" :fit="'cover'" v-loading="isLoading"
							          @load="onLoaded" style="width: 100%" :style="'height:'+windowHeight/4+'px'"/>
							<p style="margin-left: 5px">{{ videoInfo.title }}</p>
						</el-card>
					</router-link>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
	<el-backtop :right="20" :bottom="20"/>
</template>

<script setup>
import {inject, onMounted, ref, watch, watchEffect} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import {useKindListRefreshStore} from "@/store/KindListRefreshStore.js";

const router = useRouter()
const urlVideo = inject("serverUrl") + "/api/getRandomVideo"
const urlPost = inject("serverUrl") + "/api/getRandomPost"
let videoInfoList = ref([])
let postInfoList = ref([])
let page = ref(1)

let isLoading = ref(true)
let onLoaded = () => {
	isLoading.value = false
}
const windowWidth = ref(document.body.clientWidth)
const windowHeight = ref(window.innerHeight)
onMounted(async () => {
	window.addEventListener('scroll', listenBottomOut)
	//窗口变化触发
	window.addEventListener('resize', () => {
		windowWidth.value = document.body.clientWidth
		windowHeight.value = window.innerHeight
	})
	//开始先加载一遍
	const responseVideo = await axios.get(urlVideo, {
		params: {
			page: page.value
		}
	})
	videoInfoList.value = videoInfoList.value.concat(responseVideo.data.records)
	//加载封面
	const responsePost = await axios.get(urlPost)
	postInfoList.value = responsePost.data
})

//触底函数
async function listenBottomOut() {
	//从网上找的，如果可视高度+滚动高度>=页面高度，就执行
	const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
	const clientHeight = document.documentElement.clientHeight
	const scrollHeight = document.documentElement.scrollHeight
	if (scrollTop + clientHeight >= scrollHeight) {
		const response = await axios.get(urlVideo, {
			params: {
				page: page.value
			}
		})
		videoInfoList.value = videoInfoList.value.concat(response.data.records)
	}
}
</script>

<style scoped>
h1 {
	font-size: 25px;
}

.el-col {
	margin: 15px 0;
}

.el-carousel__item {
	border-radius: 10px;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
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
	font-size: 12px;
	margin: 10px;
	width: 90%;
	overflow: hidden;
	display: -webkit-box;
	/*文字换行4次，此后省略*/
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	text-overflow: ellipsis;
	word-wrap: break-word;
}

a {
	text-decoration: none;
}
</style>