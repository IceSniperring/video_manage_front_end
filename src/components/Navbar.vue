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
      <router-link v-for="(kind,index) in kindList" :to="{
        name:'kind',
        query:{
          type: kind,
          page:1
        }
      }">
        <el-menu-item :index="`2-${index+1}`">
          <span>{{ kind }}</span>
        </el-menu-item>
      </router-link>
      <!--      <router-link to="/vue3Learn">-->
      <!--        <el-menu-item index="2-1">-->
      <!--          <span>Vue3学习</span>-->
      <!--        </el-menu-item>-->
      <!--      </router-link>-->

      <!--      <router-link to="/game">-->
      <!--        <el-menu-item index="2-2">-->
      <!--          <span>游戏</span>-->
      <!--        </el-menu-item>-->
      <!--      </router-link>-->

      <!--      <router-link to="/animation">-->
      <!--        <el-menu-item index="2-3">-->
      <!--          <span>动漫</span>-->
      <!--        </el-menu-item>-->
      <!--      </router-link>-->
    </el-sub-menu>
    <router-link to="/upload">
      <el-menu-item index="3">
        <span>上传</span>
      </el-menu-item>
    </router-link>
  </el-menu>
</template>

<script setup>
import {inject, onMounted} from "vue";
import axios from "axios";

let url = inject("serverUrl") + "/api/getKind"
let kindList = []
onMounted(async () => {
  let response = await axios.get(url)
  kindList = response.data
  console.log(kindList)
})
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>