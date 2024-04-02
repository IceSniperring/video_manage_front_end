<template>
  <el-header>
    <el-row style="margin-top: 20px;cursor: pointer" align="middle" justify="start">
      <el-col :span="2">
        <el-icon type="primary" size="30" color="#3eae7d"
                 @click="useLoginFormOpen().asideFormVisible = true">
          <Menu/>
        </el-icon>
      </el-col>
      <el-col :span="20" :offset="1">
        <span style="color: gray">菜单</span>
      </el-col>
    </el-row>
  </el-header>
  <el-drawer v-model="useLoginFormOpen().asideFormVisible"
             title="I am the title"
             :with-header="false"
             direction="ltr"
             :lock-scroll="false"
             size="70%">
    <el-row align="middle" justify="space-between" style="height: 60px">
      <el-col :span="20">
        <router-link to="/home">
          <span>ice的视频管理平台</span>
        </router-link>
      </el-col>
      <el-col :span="4">
        <UserOperation/>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <SearchInput/>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script setup>

import SearchInput from "@/components/SearchInput.vue";
import UserOperation from "@/components/UserOperation.vue";

import {useLoginFormOpen} from "@/store/LoginFormOpenStore.js";
import {SwitchFilled} from "@element-plus/icons-vue";

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