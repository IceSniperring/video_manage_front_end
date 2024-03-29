<template>
  <el-row align="middle" style="height: 60px">
    <el-col :span="4">
      <router-link to="/home">
        <span>ice的视频管理平台</span>
      </router-link>
    </el-col>
    <el-col :span="8" :offset="4">
      <div class="mt-4">
        <el-input
            v-model="searchInput"
            style="max-width: 600px;height: 40px"
            placeholder="搜索一下吧！"
            class="input-with-select"
        >
          <template #append>
            <router-link :to="{
              name: 'search',
              query:{
                keyword:searchInput
              }
            }">
              <el-button :icon="Search"/>
            </router-link>
          </template>
        </el-input>
      </div>
    </el-col>
    <el-col :span="1" :offset="4">
      <el-avatar shape="square" :size="40"/>
    </el-col>

    <el-col :span="3">
      <p id="nickname">昵称：{{ nickname }}</p>
    </el-col>
  </el-row>
</template>

<script setup>

import {Search} from "@element-plus/icons-vue";
import {ref} from "vue";

let searchInput = ref()

let nickname = ref("哈哈")

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

#nickname {
  font-size: 12px;
  font-weight: 600;
  color: gray;
}
</style>