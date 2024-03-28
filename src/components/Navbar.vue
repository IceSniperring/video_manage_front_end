<template>
	<el-menu>
		<router-link to="/home">
			<el-menu-item index="1">
				<span>主页</span>
			</el-menu-item>
		</router-link>

		<el-sub-menu index="2">
			<template #title>
				<span>分类</span>
			</template>
			<router-link to="/vue3Learn">
				<el-menu-item index="2-1">
					<span>Vue3学习</span>
				</el-menu-item>
			</router-link>

			<router-link to="/movie">
				<el-menu-item index="2-2">
					<span>电影</span>
				</el-menu-item>
			</router-link>

			<router-link to="/animation">
				<el-menu-item index="2-3">
					<span>动漫</span>
				</el-menu-item>
			</router-link>
		</el-sub-menu>

	</el-menu>
</template>

<script setup>

</script>

<style scoped>
a {
	text-decoration: none;
}
</style>