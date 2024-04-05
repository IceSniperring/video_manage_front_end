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
	    <el-row>
		    <el-col :span="12">
			    <el-switch v-model="isDark" @change="toggleDark"
			               style="--el-switch-on-color:#5da0c4; --el-switch-off-color:#7e3eff">
				    <template #active-action>
					    <span class="custom-active-action"><icon-moon-fill/></span>
				    </template>
				    <template #inactive-action>
					    <span class="custom-inactive-action"><icon-sun-fill/></span>
				    </template>
			    </el-switch>
		    </el-col>
		    <el-col  :span="12">
			    <UserOperation/>
		    </el-col>
	    </el-row>
    </el-col>
  </el-row>
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'

import SearchInput from "@/components/SearchInput.vue";
import UserOperation from "@/components/UserOperation.vue";
import {ref, watch} from "vue";
const isDark = useDark()
const toggleDark = useToggle(isDark)
const isDarkTheme = ref(false)

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