<template>
	<div>
		<el-container>
			<el-header>
				<h3>
					🗂️分类：
					<span style="font-size: 22px" id="kind">{{ route.query.type }}</span>
				</h3>
				<h1>📖页数：{{ pagination.currentPage }}</h1>
			</el-header>
			<el-main>
				<el-row :gutter="20">
					<el-col style="" :span="windowWidth<600?24:(windowWidth<1200?12:6)" v-for="(videoInfo,index) in videoInfoList"
					        :key="index">
						<router-link :to="{
                name:'player',
                query:{
                  id:videoInfo.id
                }
              }">
							<el-card class="box-card">
								<el-image :src="`${inject('videoSourceUrl')}${videoInfo.postPath}`"
								          style="width: 100%" v-loading="isLoading" @load="onLoaded"
								          alt="加载失败" :fit="'cover'" :style="'height:'+windowHeight/4+'px'"
								          @mouseenter="videoInfo.isHover=true" @mouseleave="videoInfo.isHover=false"/>
								<p>{{ videoInfo.title }}</p>
								<transition name="el-fade-in-linear">
									<div class="img-info" v-show="videoInfo.isHover">
										<p style="font-size: 16px;margin-bottom: 20px">{{ videoInfo.title }}</p>
										<p>视频id：{{ videoInfo.id }}</p>
										<p>上传时间：{{ videoInfo.uploadDate }}</p>
									</div>
								</transition>
							</el-card>
						</router-link>
					</el-col>
				</el-row>
			</el-main>
			<el-footer>
				<el-row justify="center">
					<el-col :span="8" :offset="3" style="justify-content: center;display: flex">
						<el-pagination
								v-model:current-page="pagination.currentPage"
								:page-size="pagination.pageSize"
								:small="pagination.small"
								:disabled="pagination.disabled"
								:background="pagination.background"
								layout=" prev, pager, next, jumper"
								:total="pagination.total"
								@current-change="getData"
						/>
					</el-col>
				</el-row>
			</el-footer>
		</el-container>
		<el-backtop :right="20" :bottom="20"/>
	</div>
</template>

<script setup>
import {inject, onBeforeMount, onMounted, reactive, ref} from "vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {useVideoData} from "@/hooks/useVideoData.js";

const router = useRouter()
const route = useRoute()
const windowWidth = ref(document.body.clientWidth) //检测宽度变化
const serverUrl = inject("serverUrl");
let isLoading = ref(true)
let onLoaded = () => {
	isLoading.value = false
}
//调用hooks获取必要数据
const {videoInfoList, pageNum, total, fetchVideoData} = useVideoData(serverUrl);
let pagination = reactive({
	total: total,
	currentPage: 1,
	disabled: false,
	pageSize: 20,
	background: true,
	small: false,
})

onBeforeMount(() => {
	fetchVideoData(route.query.type, route.query.page);
});
const windowHeight = ref(window.innerHeight)
onMounted(() => {
	document.getElementsByClassName("el-pagination__goto")[0].innerText = "跳至";
	//窗口变化触发
	window.addEventListener('resize', () => {
		windowWidth.value = document.body.clientWidth
		windowHeight.value = window.innerHeight
	})
	console.log(videoInfoList)
});

function getData() {
	router.push({
		name: "kind",
		query: {
			type: route.query.type,
			page: pagination.currentPage
		}
	});
	fetchVideoData(route.query.type, pagination.currentPage);
}

onBeforeRouteUpdate((to, from, next) => {
	//page大于给定页数，那么执行重定向
	if (to.query.page > pageNum.value) {
		next(false)
		router.replace({
			name: "kind",
			query: {
				kind: from.query.type,
				page: from.query.page
			}
		})
		//重新获取数据
		pagination.currentPage = parseInt(from.query.page)
		fetchVideoData(from.query.type, from.query.page);
	} else {
		pagination.currentPage = parseInt(to.query.page)
		fetchVideoData(to.query.type, to.query.page);
		next()
	}
});
</script>

<style scoped>
.el-col {
	margin: 15px 0;
}

.el-image {
	transition: .2s ease-in;
}

.el-image:hover {
	filter: brightness(30%);
}

.el-card {
	border-radius: 5px;
	--el-card-padding: 0px;
	border-width: 0;
	position: relative;
}

.el-card:hover {
	box-shadow: 2px 4px 6px;
}

.box-card p {
	font-size: 12px;
	margin: 10px;
	width: 94%;
	overflow: hidden;
	display: -webkit-box;
	/*文字换行2次，此后省略*/
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	text-overflow: ellipsis;
	word-wrap: break-word;
}

.img-info {
	position: absolute;
	top: 1%;
	font-weight: 600;
	color: #dddddd;
	width: 100%;
	pointer-events: none; /* 让鼠标事件穿透 */
}

a {
	text-decoration: none;
}

#kind {
	color: #3eae7d;
}
</style>