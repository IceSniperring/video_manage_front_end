<template>
  <el-row align="middle" justify="space-between" style="height: 60px">
    <el-col :span="4">
      <router-link to="/home">
        <span>ice的视频管理平台</span>
      </router-link>
    </el-col>
    <el-col :span="8">
      <SearchInput/>
    </el-col>
    <el-col :span="2">
      <UserOperation/>
    </el-col>
  </el-row>
</template>

<script setup>


import SearchInput from "@/components/SearchInput.vue";
import UserOperation from "@/components/UserOperation.vue";
</script>

<style scoped>
span {
  font-size: 16px;
  font-weight: 900;
}

a {
  text-decoration: none;
  color: #3eae7d;
}

</style>