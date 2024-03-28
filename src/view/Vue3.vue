<template>
	<el-container style="border:1px solid black">
		<el-header style="border:1px solid black"><h2>分类：<span style="font-size: 16px">vue3学习</span></h2></el-header>
		<el-main style="border:1px solid black">


			<el-row gutter="10">
				<el-col style="" :span="6" v-for="i in 70" :key="i">
					<el-card class="box-card">
						
					</el-card>
				</el-col>
			</el-row>

		</el-main>
	</el-container>
</template>

<script setup>

</script>

<style scoped>
.el-col {
	margin:15px 0;
}
</style>