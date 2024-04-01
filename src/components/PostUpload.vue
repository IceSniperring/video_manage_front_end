<script setup>

import {Plus} from "@element-plus/icons-vue";
import {ElNotification} from "element-plus";
import {ref} from "vue";
import {usePostUploadFile} from "@/store/PostUploadFileStore.js";

const postUploadFile = usePostUploadFile()
let postUrl = ref("") //提交Url，用于前端图片显示
const onPostChange = (file, fileList) => {
  if (file.raw.type.startsWith("image/")) {
    postUrl.value = URL.createObjectURL(file.raw)
    //保证只有一张照片
    if (fileList.length > 1) {
      fileList.splice(0, 1)
    }
    //图片对象上传给pinia
    postUploadFile.postFile = file.raw
  } else {
    ElNotification({
      title: '错误',
      message: '只能上传图片(jpeg、jpg、png、gif等格式)',
      type: 'error',
    })
  }
}
</script>

<template>
  <el-upload
      class="post-uploader"
      :show-file-list="false"
      accept="image/*"
      :auto-upload="false"
      ref="postUpload"
      :on-change="onPostChange">
    <el-image v-if="postUrl" :src="postUrl" class="post" alt=""
              style="width: 200px;height: 140px;" :fit="'contain'"/>
    <el-icon v-else class="post-uploader-icon">
      <Plus/>
    </el-icon>
  </el-upload>
</template>

<style scoped>

</style>