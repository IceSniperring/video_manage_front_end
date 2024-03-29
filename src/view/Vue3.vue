<template>
  <el-container style="border:1px solid black">
    <el-header style="border:1px solid black"><h2>分类：<span style="font-size: 16px">vue3学习</span></h2></el-header>
    <el-main style="border:1px solid black">
      <el-row :gutter="20">
        <el-col style="" :span="6" v-for="i in 70" :key="i">
          <router-link :to="{
            name:'player',
            query:{
              title: i.toString()
            }
          }">
            <el-card class="box-card">
              <el-image :src="`/src/assets/vue_video/image/Vue3尚硅谷 (${i}).jpg`"
                        style="width: 100%"
                        alt="加载失败" :fit="'contain'"/>
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
.el-col {
  margin: 15px 0;
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