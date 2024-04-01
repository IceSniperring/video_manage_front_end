<template>
  <el-container>
    <el-main>
      <h1>{{ userInfo.username }}的稿件：</h1>
      <el-table
          :data="videoInfoTable"
          style="width: 100%"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          v-loading="loading">
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
            <el-button link type="primary" size="default">
              编辑
            </el-button>
            <el-button link type="primary" size="default"
                       @click="deleteVideo(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script setup>
import {inject, onBeforeMount, ref} from "vue";
import axios from "axios";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {useKindListRefreshStore} from "@/store/KindListRefreshStore.js";

let userInfo = []
let videoInfoTable = ref([])
const serverUrl = inject("serverUrl")
const videoUrl = serverUrl + "/api/getVideoByUid"
onBeforeMount(async () => {
  userInfo = JSON.parse(localStorage.getItem("userInfo"))
  let response = await axios.get(videoUrl, {params: {uid: userInfo.id}})
  videoInfoTable.value = response.data
})
let loading = ref(false)
const KindListRefreshStore = useKindListRefreshStore()

function ELMessage_result(message, type) {
  ElMessage({
    type: type,
    message: message,
  })
}

function deleteVideo(id) {
  ElMessageBox.confirm(
      '确定要删除吗',
      '删除确认',
      {
        lockScroll: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
    loading.value = true
    axios.delete(serverUrl + "/api/deleteVideo", {
      params: {
        id: id
      }
    }).then((response) => {
      const {code, success} = response.data
      if (!success) {
        if (code === 2) ELMessage_result("视频删除失败", "error")
        else if (code === 3) ELMessage_result("封面删除失败", "error")
        else if (code === 4) ELMessage_result("视频和封面都删除失败", "error")
        else if (code === 5) ELMessage_result("数据不存在", "error")
      } else if (success) {
        ELMessage_result("删除成功", "success")
      }
      //重新获取数据
      axios.get(videoUrl, {params: {uid: userInfo.id}}).then((response) => {
        videoInfoTable.value = response.data
      })
      //通知刷新分类列表
      KindListRefreshStore.KindListRefresh = true
      loading.value = false
    }).catch(() => {
      ELMessage_result("出现异常", "error")
    })
  }).catch(() => {
    ELMessage_result(userInfo.username + "取消了删除", "info")
  })
}

</script>

<style scoped>

</style>