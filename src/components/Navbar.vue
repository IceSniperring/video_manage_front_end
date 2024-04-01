<template>
  <el-menu
      mode="horizontal"
      active-text-color="#3eae7d"
      menu-trigger="click"
      :close-on-click-outside="true">
    <router-link to="/home">
      <el-menu-item index="1" style="border-radius: 10px">
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
    </el-sub-menu>
    <router-link to="/upload">
      <el-menu-item index="3" style="border-radius: 10px">
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
})
</script>

<style scoped>
a {
  text-decoration: none;
}
.el-menu.el-menu--horizontal{
  border: none;
}

</style>