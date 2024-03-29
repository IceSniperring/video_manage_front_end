<template>
	<el-container>
		<el-upload
				class="upload-demo"
				drag
				action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
				multiple
				style="width: 100%;border:1px solid black">
			<el-icon class="el-icon--upload">
				<upload-filled/>
			</el-icon>
			<div class="el-upload__text">
				<em>点击上传</em> 或者<em> 将文件拖拽到此</em>
			</div>
			<template #tip>
				<div class="el-upload__tip">
					<h3>jpg/png格式 < 500kb</h3>
				</div>
			</template>
		</el-upload>
	</el-container>
</template>

<script setup>

</script>

<style scoped>

</style>