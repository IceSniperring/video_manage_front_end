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
            <el-button :icon="Search" @click="search"/>
          </template>
        </el-input>
      </div>
    </el-col>
    <el-col :span="1" :offset="4">
      <el-popover placement="bottom" :width="100" trigger="hover">
        <template #reference>
          <el-avatar shape="circle" :size="40"
                     v-if="logged_in"
                     :src="avatar"/>
        </template>
        <el-row>
          <el-col :span="12" :offset="6">
            <p class="userMenu"
               @click="logout">
              注销</p>
            <p class="userMenu"
               @click="videoManage">
              管理稿件
            </p>
          </el-col>
        </el-row>
      </el-popover>
    </el-col>

    <el-col :span="3">
      <!--登录逻辑-->
      <el-button plain @click="useLoginFormOpen().dialogFormVisible=true" v-show="!logged_in">
        登录
      </el-button>
      <el-dialog v-model="useLoginFormOpen().dialogFormVisible"
                 :title="loginTitle"
                 width="500" style="border-radius: 10px"
                 :lock-scroll="false"><!--解除禁用滚动条，防止闪屏-->
        <el-form :model="form" v-show="isLogin">
          <el-form-item label="用户名或者邮箱" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input type="password" v-model="form.password"/>
          </el-form-item>
        </el-form>
        <el-form :model="form" v-show="!isLogin">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input type="password" v-model="form.password"/>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth">
            <el-input type="password" v-model="form.passwordTwice"/>
          </el-form-item>
          <el-form-item label="请上传头像" :label-width="formLabelWidth">
            <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :on-change="onAvatarChange"
                :auto-upload="false"
                accept="image/*"
                ref="avatarUpload">
              <el-image v-if="avatarUrl" :src="avatarUrl" class="avatar"/>
              <el-icon v-else class="avatar-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="changeForm">{{ isLogin ? "注册" : "登录" }}</el-button>
            <el-button type="primary" @click="submit">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
      <el-text v-if="logged_in" id="nickname">{{ nickname }}</el-text>
    </el-col>
  </el-row>
</template>

<script setup>

import {Plus, Search} from "@element-plus/icons-vue";
import {ref, reactive, inject, onBeforeMount} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {useLoginFormOpen} from "@/store/LoginFormOpenStore.js";//登陆表格状态

const serverUrl = inject("serverUrl")//服务器url
const formLabelWidth = '160px'//表格宽度
let isLogin = ref(true)//表格是否是登陆界面
const loginTitle = ref("登录")//表格标题
let logged_in = ref(false)//登录状态
let nickname = ref("")//用户名
let avatarUrl = ref("") //用户头像Url，用于前端图片显示
//用户登陆表格
const form = reactive({
  username: '',
  password: '',
  email: '',
  passwordTwice: ''
})
let avatar = ref()//用户头像
let userInfo = []//用户所有信息
const router = useRouter()//路由信息
let searchInput = ref("")//搜索框
let formData = new FormData()//封装图片以及其余参数
let percentCompleted = ref(0)
let config = {
  headers: {
    'Content-Type': 'multipart/form-data' //指定类型
  },
  //获得上传进度
  onUploadProgress: progressEvent => {
    percentCompleted.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  }
}
let search = () => {
  if (searchInput.value !== "") {
    router.push({
      path: 'search',
      query: {
        page: 1,
        keyword: searchInput.value
      }
    })
  } else {
    ElNotification({
      title: '错误',
      message: '请输入搜索内容',
      type: 'error',
      position: 'top-left'
    })
  }
}
let changeForm = () => {
  isLogin.value = !isLogin.value;
  if (isLogin.value) {
    loginTitle.value = "登录"
  } else {
    loginTitle.value = "注册"
  }
}

onBeforeMount(() => {
  userInfo = JSON.parse(localStorage.getItem("userInfo"))
  if (userInfo !== null) {
    nickname = userInfo.username
    //获取头像
    avatar = serverUrl + userInfo.avatarPath
    //登陆状态置为真
    logged_in.value = true;
  }
})

function logout() {
  ElMessageBox.confirm(
      '确定要注销吗',
      '注意！',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
    localStorage.removeItem("userInfo");
    logged_in.value = false;
    ElMessage({
      type: 'success',
      message: '注销成功',
      lockScroll: false
    })
    //回到主页面
    router.push({
      name: "home"
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: userInfo.username + '取消注销',
      lockScroll: false
    })
  })
}

//管理稿件
function videoManage() {
  router.push({
    name: "videoManage",
  })
}

const onAvatarChange = (file, fileList) => {
  if (file.raw.type.startsWith("image/")) {
    avatarUrl.value = URL.createObjectURL(file.raw)
    //保证只有一张照片
    if (fileList.length > 1) {
      fileList.splice(0, 1)
    }
    formData.set("avatarFile", file.raw)
  } else {
    ElNotification({
      title: '错误',
      message: '只能上传图片(jpeg、jpg、png、gif等格式)',
      type: 'error',
    })
  }
}

function ELNotification_function(message) {
  ElNotification({
    title: '错误',
    message: message,
    type: 'error',
    position: "bottom-left"
  })
}

async function submit() {
  if (isLogin.value) {//登录逻辑
    //登录请求
    let response = await axios.post("http://localhost:8080/api/login", {
      "username": form.username,
      "password": form.password
    })
    //success为是否成功，code为后台传输的代码，1表示成功，2表示密码错误，3表示用户不存在
    let {success, code} = response.data
    let loginResult = "success";
    let loginMessage = "登陆成功"
    if (!success) {
      loginResult = "error"
    }
    if (code === 2) {
      loginMessage = "密码错误！"
    } else if (code === 3) {
      loginMessage = "用户不存在，请注册！"
    }
    ElNotification({
      title: '登陆结果',
      message: loginMessage,
      type: loginResult,
      position: 'bottom-left'
    })
    //登陆成功后获取用户信息
    if (success) {
      let response = await axios.get(serverUrl + "/api/getUserInfo", {
        params: {
          username: form.username
        }
      })
      //本地存储
      localStorage.setItem("userInfo", JSON.stringify(response.data))
      //获取用户名
      nickname = response.data.username
      //获取头像
      avatarUrl.value = serverUrl + response.data.avatarPath
      //登陆状态置为真
      logged_in.value = true;
      //隐藏表
      useLoginFormOpen().dialogFormVisible = false
      //刷新
      window.location.reload()
    }
  } else if (!isLogin.value) {//注册逻辑
    if (form.username === '') {
      ElNotification('请输入用户名')
    } else if (form.password === "") {
      ELNotification_function('请输入密码')
    } else if (form.email === '') {
      ELNotification_function('请输入邮箱')
    } else if (form.passwordTwice !== form.password) {
      ELNotification_function('两次输入的密码不一致')
    } else if (/^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(form.email) === false) {
      ELNotification_function("邮箱格式错误")
    } else if (form.password.length < 8) {
      ELNotification_function("密码过短，至少8位")
    } else if (formData.get("avatarFile") == null) {
      ELNotification_function("请选择头像")
    } else {
      formData.set("username", form.username)
      formData.set("email", form.email);
      formData.set("password", form.password)
      let response = await axios.post(serverUrl + "/api/signup", formData, config)
      const {success, code} = response.data
      let signUpResult = "success";
      let signUpMessage = "注册成功"
      if (!success) {
        signUpResult = "error"
      }
      if (code === 2) {
        signUpMessage = "用户名已存在，请重新输入！"
      } else if (code === 3) {
        signUpMessage = "邮箱已存在，请重新输入！"
      } else if (code === 4) {
        signUpMessage = "未知错误！！！"
      }
      ElNotification({
        title: '注册结果',
        message: signUpMessage,
        type: signUpResult,
        position: 'bottom-left'
      })
      //注册成功自动登录
      if (success) {
        let response = await axios.get(serverUrl + "/api/getUserInfo", {
          params: {
            username: form.username
          }
        })
        //本地存储
        localStorage.setItem("userInfo", JSON.stringify(response.data))
        //获取用户名
        nickname = response.data.username
        //获取头像
        avatarUrl.value = serverUrl + response.data.avatarPath
        //登陆状态置为真
        logged_in.value = true;
        //隐藏表
        useLoginFormOpen().dialogFormVisible = false
        //刷新
        window.location.reload()
      }
    }
  }
}
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
  font-size: 16px;
  font-weight: 600;
  color: gray;
}

.userMenu {
  transition: .2s;
}

.userMenu:hover {
  color: #3eae7d;
  cursor: pointer;
}

.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 100%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 25px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>