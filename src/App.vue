<template>
	<el-container>
		<el-header style="border:1px solid black">
			<Header/>
		</el-header>
		<el-container>
			<el-aside style="width: 130px;border:1px solid black">
				<Navbar/>
			</el-aside>
			<el-main style="border:1px solid black">
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Header from "@/components/Header.vue";
</script>

<style scoped>
</style>