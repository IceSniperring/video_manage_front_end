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
                        :initial-index="4" style="width: 100px;border-radius: 2px" preview-teleported/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="uploadDate" label="上传时间"/>
        <el-table-column label="分类" prop="kind"/>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="default"
                       @click="openEditPanel(scope.row)">
              编辑
            </el-button>
            <el-button link type="primary" size="default"
                       @click="deleteVideo(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="editVideoInfo"
                 title="编辑此视频"
                 width="500" style="border-radius: 10px"
                 :lock-scroll="false"><!--解除禁用滚动条，防止闪屏-->
        <el-form :model="form">
          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input v-model="form.title" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="请上传封面" :label-width="formLabelWidth">
            <PostUpload/>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="editSubmit()">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import {inject, onBeforeMount, onUnmounted, reactive, ref} from "vue";
import axios from "axios";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {useKindListRefreshStore} from "@/store/KindListRefreshStore.js";
import {usePostUploadFile} from "@/store/PostUploadFileStore.js";
import PostUpload from "@/components/PostUpload.vue";

const postUploadFile = usePostUploadFile()
const formLabelWidth = '100px'
let editVideoInfo = ref(false)
let form = reactive({
  title: ""
})
let userInfo = []
let videoInfoTable = ref([])
const serverUrl = inject("serverUrl")
const videoUrl = serverUrl + "/api/getVideoByUid"
onBeforeMount(async () => {
  userInfo = JSON.parse(localStorage.getItem("userInfo"))
  let response = await axios.get(videoUrl, {params: {uid: userInfo.id}})
  videoInfoTable.value = response.data
})
let percentCompleted = ref(0)
let loading = ref(false)
let formData = new FormData()
const KindListRefreshStore = useKindListRefreshStore()

function ELMessage_result(message, type) {
  ElMessage({
    type: type,
    message: message,
  })
}

function ELNotification_result(title, message, type) {
  ElNotification({
    title: title,
    message: message,
    type: type
  })
}

let config = {
  headers: {
    'Content-Type': 'multipart/form-data' //指定类型
  },
  //获得上传进度
  onUploadProgress: progressEvent => {
    percentCompleted.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  }
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

function openEditPanel(videoInfo) {
  editVideoInfo.value = true
  form.title = videoInfo.title
  formData.set("id", videoInfo.id)//存储id
}

async function editSubmit() {
  if (form.title === "") ELNotification_result("错误", "请输入标题", "error")
  else if (postUploadFile.postFile === null) ELNotification_result("错误", "请选择封面", "error")
  else {
    loading.value = true
    formData.set("title", form.title)
    formData.set("postFile", postUploadFile.postFile);
    let response = await axios.put(serverUrl + "/api/updateVideoInfo", formData, config)
    let {success, code} = response.data
    if (!success) {
      if (code === 2) ELNotification_result("修改结果", "未知错误", "error")
      else if (code === 3) ELNotification_result("修改结果", "无法删除旧封面", "error")
      else if (code === 4) ELNotification_result("修改结果", "无法保存新封面", "error")
      else if (code === 5) ELNotification_result("修改结果", "该视频不存在，请刷新后重试", "error")
    }
    if (success) {
      ELNotification_result("修改结果", "修改成功", "success")
      editVideoInfo.value = false
      //重新获取数据
      axios.get(videoUrl, {params: {uid: userInfo.id}}).then((response) => {
        videoInfoTable.value = response.data
      })
      loading.value = false
    }
  }
}

onUnmounted(() => {
  //退出时置为空，防止出现后面实例依然存在的bug
  postUploadFile.postFile = null
})
</script>

<style scoped>

</style>