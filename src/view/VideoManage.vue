<template>
  <el-container>
    <el-main>
      <h1>{{ userInfo.username }}的稿件：</h1>
      <el-table
          :data="videoInfoTable"
          style="width: 100%"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="title" label="视频名称"/>
        <el-table-column label="封面">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image :src="`${inject('serverUrl')}${scope.row.postPath}`"
                        :preview-src-list="[`${inject('serverUrl')}${scope.row.postPath}`]"
                        :initial-index="4" style="width: 100px" preview-teleported/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="uploadDate" label="上传时间"/>
        <el-table-column label="分类" prop="kind"/>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="default"
            >编辑
            </el-button
            >
            <el-button link type="primary" size="default" @click="deleteVideo(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import {inject, onBeforeMount, ref} from "vue";
import axios from "axios";

let userInfo = []
let videoInfoTable = ref([])
const videoUrl = inject("serverUrl") + "/api/getVideoByUid"
onBeforeMount(async () => {
  userInfo = JSON.parse(localStorage.getItem("userInfo"))
  let response = await axios.get(videoUrl, {params: {uid: userInfo.id}})
  videoInfoTable.value = response.data
})

function deleteVideo(id) {

}

</script>

<style scoped>

</style>