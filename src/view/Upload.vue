<template>
  <el-container>
    <el-main>
      <el-row :gutter="20" align="middle" justify="center" style="margin-bottom: 10px">
        <el-col :span="15">
          <el-progress
              type="line"
              :percentage="percentCompleted"
              :stroke-width="20"
              :text-inside="true"
              v-if="percentCompleted!=0"
              :status="percentCompleted==100?'success':'exception'">
          </el-progress>
        </el-col>
      </el-row>
      <el-row :gutter="20" align="middle" justify="center">
        <el-col :span="15">
          <el-upload
              drag
              multiple
              name="video"
              :auto-upload="false"
              ref="videoUpload"
              :on-change="onVideoChange"
              accept="video/*"
              :on-remove="onRemoveVideo"
              :disabled="isLogged">
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              <em>点击上传</em> 或者<em> 将文件拖拽到此</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                <h3>视频格式 < 1GB（一次只能上传一个）</h3>
              </div>
            </template>
          </el-upload>
        </el-col>
      </el-row>

      <el-row :gutter="20" align="middle" justify="center">
        <el-col :span="15">
          <el-row justify="space-between">
            <el-col :span="6">
              <el-form>
                <el-form-item>
                  <label>请上传封面：</label>
                  <PostUpload/>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6">
              <el-form>
                <el-form-item>
                  <label>请输入你的分类：</label>
                  <el-input v-model="kind" :disabled="isLogged"></el-input>
                </el-form-item>
                <el-button type="primary" style="width: 100%"
                           @click="submitForm" :disabled="isLogged">提交
                </el-button>
              </el-form>
            </el-col>
            <el-col>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {UploadFilled} from "@element-plus/icons-vue";
import {inject, onBeforeMount, onUnmounted, ref} from "vue";
import axios from "axios";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {useLoginFormOpen} from "@/store/LoginFormOpenStore.js";
import {useRouter} from "vue-router";
import {useKindListRefreshStore} from "@/store/KindListRefreshStore.js";
import PostUpload from "@/components/PostUpload.vue";
import {usePostUploadFile} from "@/store/PostUploadFileStore.js";

const router = useRouter()
let kind = ref("") //类型
let postUpload = ref() //ref绑定的封面，方便操作
let videoUpload = ref() //ref绑定的视频，方便操作
let percentCompleted = ref(0)
let formData = new FormData() //formData封装视频以及其余参数
let userInfo = ref();
const serverUrl = inject("serverUrl")
const url = serverUrl + "/api/videoUpload"
let isLogged = true //判断用户是否登录,未登录就禁用组件
const KindListRefresh = useKindListRefreshStore()
const postUploadFile = usePostUploadFile()
let config = {
  headers: {
    'Content-Type': 'multipart/form-data' //指定类型
  },
  //获得上传进度
  onUploadProgress: progressEvent => {
    percentCompleted.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  }
}

//只有登陆了才能上传文件
onBeforeMount(() => {
  userInfo.value = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo.value == null) {
    ElNotification({
      title: '错误',
      message: '需要登录才能上传哦！请你登陆',
      type: 'error',
    })
    setTimeout(() => {
      //延迟200ms显示登陆界面
      useLoginFormOpen().dialogFormVisible = true
    }, 200)
  } else {
    isLogged = false
  }
})
const onVideoChange = (file, fileList) => {
  if (file.raw.type.startsWith("video/")) {
    //保证只能上传一个文件
    if (fileList.length > 1) {
      fileList.splice(0, 1);
    }
    formData.set("videoFile", file.raw)
  } else {
    const index = fileList.indexOf(file);
    if (index !== -1) {
      fileList.splice(index, 1);
    }
    ElNotification({
      title: '错误',
      message: '只能上传视频(mp4、avi等格式)',
      type: 'error',
    })
  }
}
const onRemoveVideo = () => {
  formData.delete("videoFile")
}


function ELNotification_result(title, message, type) {
  ElNotification({
    title: title,
    message: message,
    type: type
  })
}

async function submitForm() {
  if (formData.get("videoFile") == null) {
    ELNotification_result("错误", "请选择视频", "error")
  } else if (postUploadFile.postFile == null) {
    ELNotification_result("错误", "请选择封面", "error")
  } else {
    //进度清零
    percentCompleted.value = 0
    formData.set("uid", userInfo.value.id)
    formData.set("postFile", postUploadFile.postFile)
    //是否选择了分类
    if (kind.value == "") {
      ELNotification_result("错误", "请输入分类", "error")
    } else {
      formData.set("kind", kind.value)
      let response = await axios.post(url, formData, config)
      const {success, code, video} = response.data
      console.log(video)
      if (!success) {
        if (code === 2) {
          ELNotification_result("上传结果", "视频上传失败", "error")
        } else if (code === 3) {
          ELNotification_result("上传结果", "封面上传失败", "error")
        } else if (code === 4) {
          ELNotification_result("上传结果", "视频和封面都上传失败", "error")
        }
      } else if (success) {
        //通知刷新分类列表
        KindListRefresh.KindListRefresh = true
        ELNotification_result("上传结果", "上传成功", "success")
        ElMessageBox.confirm(
            '上传成功，需要前往视频的播放页面吗？',
            '上传结果',
            {
              lockScroll: false,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
          router.push({
            name: "player",
            query: {
              id: video.id
            }
          })
        }).catch(() => {
          ElMessage({
            type: "info",
            message: userInfo.value.username + "已取消",
          })
        })
      }
    }
  }
}

onUnmounted(() => {
  //退出时置为空，防止出现后面实例依然存在的bug
  postUploadFile.postFile = null
})

</script>

<style scoped>
.post-uploader .post {
  width: 200px;
  height: 140px;
  display: block;
}
</style>

<style>
.post-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.post-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.post-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 140px;
  text-align: center;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>
