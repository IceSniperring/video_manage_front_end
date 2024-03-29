<template>
	<el-container id="container">
		<el-header>
			<Header/>
		</el-header>
		<el-container>
			<el-aside style="width: 130px;">
				<Navbar/>
			</el-aside>
			<el-main>
				<router-view>
        </router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Header from "@/components/Header.vue";
</script>

<style scoped>
#container {
  border-radius: 10px;
  box-shadow: 0 0 10px;
  overflow: hidden;
}
</style>