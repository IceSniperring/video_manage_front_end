<template>
	<el-container>
		<el-main>
			<el-row>
				<el-col :span="16">
					<h1>历史记录</h1>
				</el-col>
				<el-col :span="2">
					<el-button type="danger" v-show="idArray.length!==0"
					           @click="deleteRecords">
						批量删除
					</el-button>
				</el-col>
				<el-col :span="6">
					<el-input v-model="tableSearch" placeholder="搜索视频"/>
				</el-col>
			</el-row>

			<el-table
					:data="filterHistoryTable"
					style="width: 100%"
					row-key="id"
					:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
					v-loading="loading"
					@selection-change="handelSelectionChange" stripe>
				<el-table-column type="selection" width="55"/>
				<el-table-column prop="title" label="视频名称"/>
				<el-table-column label="封面">
					<template #default="scope">
						<div style="display: flex; align-items: center">
							<router-link :to="{
									name:'player',
									query:{
										id:scope.row.videoId
									}
							}">
								<el-image :src="`${inject('videoSourceUrl')}${scope.row.postPath}`"
								          :initial-index="4" style="width: 100px;border-radius: 2px" preview-teleported/>
							</router-link>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="viewDate" label="观看时间"/>
				<el-table-column label="分类" prop="kind"/>
				<el-table-column fixed="right" width="150" label="操作">
					<template #default="scope">
						<el-button link type="primary" size="default"
						           @click="deleteRecord(scope.row.recordId)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
	</el-container>
</template>

<script setup>
import {computed, inject, onBeforeMount, reactive, ref} from "vue";
import axios from "axios";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {useKindListRefreshStore} from "@/store/KindListRefreshStore.js";
import {usePostUploadFile} from "@/store/PostUploadFileStore.js";
import {useRouter} from "vue-router";

const postUploadFile = usePostUploadFile()
const formLabelWidth = '100px'
let form = reactive({
	title: ""
})
let userInfo = []
const tableSearch = ref()
const filterHistoryTable = computed(() =>
		historyTable.value.filter((data) =>
				!tableSearch.value ||
				data.title.toLowerCase().includes(tableSearch.value.toLowerCase())
		)
)
const serverUrl = inject("serverUrl")
const historyUrl = serverUrl + "/api/getHistory"
let percentCompleted = ref(0)
let loading = ref(false)
const router = useRouter()
const KindListRefreshStore = useKindListRefreshStore()
let historyTable = ref([])
onBeforeMount(async () => {
	userInfo = JSON.parse(localStorage.getItem("userInfo"))
	let response = await axios.get(historyUrl, {params: {uid: userInfo.id}})
	historyTable.value = response.data
})


function ELMessage_result(message, type) {
	ElMessage({
		type: type,
		message: message,
	})
}

function ELNotification_result(title, message, type) {
	ElNotification({
		title: title,
		message: message,
		type: type
	})
}

let config = {
	headers: {
		'Content-Type': 'multipart/form-data' //指定类型
	},
	//获得上传进度
	onUploadProgress: progressEvent => {
		percentCompleted.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
	}
}

let idArray = ref([])//id数组，保存多选框的id
function handelSelectionChange(val) {
	idArray.value = val.map(obj => obj.recordId);
}

function deleteRecord(recordId) {
	ElMessageBox.confirm(
			'确定要删除吗',
			'删除确认',
			{
				lockScroll: false,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
		loading.value = true
		axios.delete(serverUrl + "/api/deleteHistory", {
			params: {
				id: recordId
			}
		}).then((response) => {
			const {success, code} = response.data
			if (!success) {
				if (code === 5) ELMessage_result(failedId + "记录删除失败，该记录不存在", "error")
				else if (code === 6) ELMessage_result(failedId + "未知错误", "error")
			} else if (success) {
				ELMessage_result("删除成功", "success")
			}
			//重新获取数据
			axios.get(historyUrl, {params: {uid: userInfo.id}}).then((response) => {
				historyTable.value = response.data
			})
			//通知刷新分类列表
			KindListRefreshStore.KindListRefresh = true
			loading.value = false
		}).catch((error) => {
			ELMessage_result("出现异常", "error")
			router.push(({
				name: "error",
				query: {
					code: error.response.status
				}
			}))
		})
	}).catch(() => {
		ELMessage_result(userInfo.username + "取消了删除", "info")
	})
}

//批量删除
function deleteRecords() {
	ElMessageBox.confirm(
			'确定要删除这些记录吗',
			'删除确认',
			{
				lockScroll: false,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
		loading.value = true
		axios.delete(serverUrl + "/api/deleteHistory", {
			params: {
				id: idArray.value.join(",")//传输数组
			}
		}).then((response) => {
			const {success, code} = response.data
			if (!success) {
				if (code === 5) ELMessage_result(failedId + "记录删除失败，该记录不存在", "error")
				else if (code === 6) ELMessage_result(failedId + "未知错误", "error")
			} else if (success) {
				ELMessage_result("删除成功", "success")
			}
			//重新获取数据
			axios.get(historyUrl, {params: {uid: userInfo.id}}).then((response) => {
				historyTable.value = response.data
			})
			//通知刷新分类列表
			KindListRefreshStore.KindListRefresh = true
			loading.value = false
		}).catch((error) => {
			ELMessage_result("出现异常", "error")
			router.push(({
				name: "error",
				query: {
					code: error.response.status
				}
			}))
		})
	}).catch(() => {
		ELMessage_result(userInfo.username + "取消了删除", "info")
	})
}
</script>

<style scoped>

</style>