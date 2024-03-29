<template>
	<h1>主页</h1>
	<el-container>
		<el-main>
			<el-row id="carousel">
				<el-col :span="24">
					<el-carousel motion-blur>
						<el-carousel-item v-for="item in 4" :key="item">
							<el-image src="/src/assets/vue_video/image/Vue3尚硅谷 (1).jpg"
							          style="width: 100%;"
							          fit="fill"/>
						</el-carousel-item>
					</el-carousel>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col v-for="i in 4" :span="6">
					<router-link :to="{
								 name:'player',
                 query: {
                    title: i.toString()
                }
							}">
						<el-card class="box-card">
							<el-image :src="`/src/assets/vue_video/image/Vue3尚硅谷 (${i}).jpg`"
							          alt="加载失败" :fit="'scale-down'"/>
							<p>Vue3尚硅谷 ({{ i }})</p>
						</el-card>
					</router-link>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>

<script setup>

</script>

<style scoped>
.el-carousel__item h3 {
	color: #475669;
	opacity: 0.75;
	line-height: 200px;
	margin: 0;
	text-align: center;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}

#carousel {
	border-radius: 5px;
	overflow: hidden;
	margin-bottom: 20px;
	box-shadow: 2px 4px 6px;
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


a {
	text-decoration: none;
}
</style>