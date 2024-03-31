<template>
  <el-container>
    <h1>{{ userInfo.username }}的稿件：</h1>
    <el-main>

    </el-main>
  </el-container>
</template>

<script setup>
import {onBeforeMount} from "vue";

let userInfo = []

onBeforeMount(() => {
  userInfo = JSON.parse(localStorage.getItem("userInfo"))
  if (userInfo != null) {
    console.log(userInfo.username)
  }
})
</script>

<style scoped>

</style>