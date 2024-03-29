<template>
  <el-container>
    <el-header><h2>分类：<span style="font-size: 16px">vue3学习</span></h2></el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col style="" :span="6" v-for="(src,index) in srcList" :key="index">
          <router-link :to="{
            name:'player',
            query:{
              title: (index+1).toString()
            }
          }">
            <el-card class="box-card">
              <el-image :src="src"
                        style="width: 100%"
                        alt="加载失败" :fit="'contain'"/>
              <p>Vue3尚硅谷 ({{ index + 1 }})</p>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import {onMounted, ref} from "vue";

const srcNum = 70

let srcList = ref([])

onMounted(() => {
  for (let i = 1; i <= srcNum; i++) {
    srcList.value.push(`/src/assets/vue_video/image/Vue3尚硅谷 (${i}).jpg`)
  }
})
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