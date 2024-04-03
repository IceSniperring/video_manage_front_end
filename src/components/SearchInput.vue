<script setup>
import {Search} from "@element-plus/icons-vue";
import {ref} from "vue";
import {ElNotification} from "element-plus";
import {router} from "@/router/index.js";

let searchInput = ref("")//搜索框
let search = () => {
	if (searchInput.value !== "") {
		router.push({
			path: 'search',
			query: {
				page: 1,
				keyword: searchInput.value
			}
		})
	} else {
		ElNotification({
			title: '错误',
			message: '请输入搜索内容',
			type: 'error',
			position: 'top-left'
		})
	}
}
</script>

<template>
	<div class="mt-4">
		<el-input
				v-model="searchInput"
				style="max-width: 600px;height: 40px"
				placeholder="搜索一下吧！回车可直接搜索"
				class="input-with-select"
				:clearable="true"
				@keydown.enter.native="search"
		>
			<template #append>
				<el-button :icon="Search" @click="search"/>
			</template>
		</el-input>
	</div>
</template>

<style scoped>

</style>