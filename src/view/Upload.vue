<template>
  <el-container>
    <el-main>
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
              :on-remove="onRemoveVideo">
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              <em>点击上传</em> 或者<em> 将文件拖拽到此</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                <h3>mp4格式 < 300MB</h3>
              </div>
            </template>
          </el-upload>

          <el-row justify="center" align="middle">
            <el-col :span="12">
              <el-form>
                <el-form-item>
                  <label>请输入你的分类：</label>
                  <el-input v-model="kind">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <!--后面需要补上上传-->
                  <label>请选择封面：</label>
                  <el-upload
                      class="post-uploader"
                      :show-file-list="false"
                      accept="image/*"
                      :auto-upload="false"
                      ref="postUpload"
                      :on-change="onPostChange"
                  >
                    <el-image v-if="postUrl" :src="postUrl" class="post" alt=""
                              style="width: 200px;height: 140px;" :fit="'contain'"/>
                    <el-icon v-else class="post-uploader-icon">
                      <Plus/>
                    </el-icon>
                  </el-upload>
                </el-form-item>
                <el-button type="primary" style="width: 71%"
                           @click="submitForm">提交
                </el-button>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-progress
                  type="dashboard"
                  :percentage="percentCompleted"
                  :stroke-width="30"
                  :width="300">
                <template #default="{ percentage }">
                  <span class="percentage-label">上传进度</span>
                  <span class="percentage-value">{{ percentage }}%</span>
                </template>
              </el-progress>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {Plus, UploadFilled} from "@element-plus/icons-vue";
import {inject, onBeforeMount, ref} from "vue";
import axios from "axios";
import {ElNotification} from "element-plus";
import {useLoginFormOpen} from "@/store/LoginFormOpenStore.js";
import {useRouter} from "vue-router";

const router = useRouter()
let kind = ref() //类型
let postUrl = ref("") //提交Url，用于前端图片显示
let postUpload = ref() //ref绑定的封面，方便操作
let videoUpload = ref() //ref绑定的视频，方便操作
let percentCompleted = ref(0)
let formData = new FormData() //formData封装视频以及其余参数
let userInfo = ref();
const url = inject("serverUrl") + "/api/videoUpload"
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
    //监听用户是否手动关闭，如果是的，那么返回主页面
    window.addEventListener('click', () => {
      if (useLoginFormOpen().manualClose === true) {
        router.push({
          name: "home"
        })
      }
    })
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

//动态修改图片地址并增加formData内容
const onPostChange = (file, fileList) => {
  if (file.raw.type.startsWith("image/")) {
    postUrl.value = URL.createObjectURL(file.raw)
    //保证只有一张照片
    if (fileList.length > 1) {
      fileList.splice(0, 1)
    }
    formData.set("postFile", file.raw)
  } else {
    ElNotification({
      title: '错误',
      message: '只能上传图片(jpeg、jpg、png、gif等格式)',
      type: 'error',
    })
  }
}

function submitForm() {
  if (formData.get("videoFile") == null) {
    ElNotification({
      title: '错误',
      message: '请选择视频',
      type: 'error',
      position: 'bottom-left'
    })
  } else if (formData.get("postFile") == null) {
    ElNotification({
      title: '错误',
      message: '请选择封面',
      type: 'error',
      position: 'bottom-left'
    })
  } else {
    //进度清零
    percentCompleted.value = 0
    formData.set("uid", userInfo.value.id)
    //是否选择了分类
    if (kind.value == null) {
      ElNotification({
        title: '错误',
        message: '请输入分类',
        type: 'error',
        position: 'bottom-left'
      })
    } else {
      formData.set("kind", kind.value)
      axios.post(url, formData, config).then((response) => {
        console.log(response)
      })
    }
  }
}
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
