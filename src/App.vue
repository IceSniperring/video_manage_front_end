<template>
	<el-container id="container">
		<el-header v-if="windowWidth>1000">
			<Header/>
		</el-header>
		<el-header v-else>
			<AsideMenu/>
		</el-header>
		<el-container>
			<el-header>
				<Navbar/>
			</el-header>
			<el-main>
				<router-view v-slot="{Component}">
					<transition name="el-fade-in-linear">
						<component :is="Component" />
					</transition>
				</router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Header from "@/components/Header.vue";
import {onMounted, ref} from "vue";
import AsideMenu from "@/components/AsideMenu.vue";
import 'animate.css'

const windowWidth = ref(document.body.clientWidth)
onMounted(() => {
	//窗口变化触发
	window.addEventListener('resize', () => {
		windowWidth.value = document.body.clientWidth
	})
})
</script>

<style scoped>
/*盒子阴影
#container {
  border-radius: 10px;
  box-shadow: 0 0 10px;
}*/
</style>