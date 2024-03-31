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
          <el-col :span="8" :offset="8">
            <span id="logout"
                  @click="logout">
              注销</span>
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
                 :before-close="onBeforeDialogClose"
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
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="changeForm">注册</el-button>
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

import {Search} from "@element-plus/icons-vue";
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
const loginDialog = ref()
//用户登陆表格
const form = reactive({
  username: '',
  password: '',
  email: '',
  passwordTwice: ''
})
let avatar = ref()//用户头像
let userInfo = ref([])//用户所有信息
const router = useRouter()//路由信息
let searchInput = ref()//搜索框
let search = () => {
  router.push({
    path: 'search',
    query: {
      page: 1,
      keyword: searchInput.value
    }
  })
}
let changeForm = () => {
  isLogin.value = !isLogin.value;
  if (isLogin.value) {
    loginTitle.value = "登录"
  } else {
    loginTitle.value = "注册"
  }
}
//登录对话框被手动关闭
let onBeforeDialogClose = () => {
  //将组件设为不可视
  useLoginFormOpen().dialogFormVisible = false
  //通知组件时用户手动关闭
  useLoginFormOpen().manualClose = true
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
      message: '用户取消注销',
      lockScroll: false
    })
  })
}

async function submit() {
  if (isLogin) {
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
      let response = await axios.get("http://localhost:8080/api/getUserInfo", {
        params: {
          username: form.username
        }
      })
      //本地存储
      localStorage.setItem("userInfo", JSON.stringify(response.data))
      //获取用户名
      nickname = response.data.username
      //获取头像
      avatar = serverUrl + response.data.avatarPath
      //登陆状态置为真
      logged_in.value = true;
      //隐藏表
      useLoginFormOpen().dialogFormVisible = false
      //非手动关闭
      useLoginFormOpen().manualClose = false
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

#logout {
  transition: .2s;
}

#logout:hover {
  color: #3eae7d;
  cursor: pointer;
}
</style>