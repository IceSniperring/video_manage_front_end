<template>
  <el-container>
    <el-header>
      <h3>
        分类：
        <span style="font-size: 22px" id="kind">游戏</span>
      </h3>
      <h1>页数：{{ route.query.page }}</h1>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col style="" :span="6" v-for="(videoInfo,index) in videoInfoList" :key="index">
          <router-link :to="{
                name:'player',
                query:{
                  title: videoInfo.title,
                  path: videoInfo.filePath
                }
              }">
            <el-card class="box-card">
              <el-image :src="`${inject('serverUrl')}${videoInfo.postPath}`"
                        style="width: 100%"
                        alt="加载失败" :fit="'contain'"/>
              <p>{{ videoInfo.title }}</p>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row justify="center" align="middle">
        <el-col :span="6">
          <el-pagination
              v-model:current-page="pagination.currentPage"
              :page-size="pagination.pageSize"
              :small="pagination.small"
              :disabled="pagination.disabled"
              :background="pagination.background"
              layout=" prev, pager, next, jumper"
              :total="pagination.total"
              @current-change="getData"
          />
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script setup>
import {inject, onMounted, reactive, ref} from "vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import axios from "axios";

const router = useRouter()
const route = useRoute()
const url = inject("serverUrl") + "/api/getVideoByKind"
let pagination = reactive({
  total: 0,
  currentPage: 1,
  disabled: false,
  pageSize: 20,
  background: true,
  small: false,
})
let pageNum = 0
let videoInfoList = ref([])

onMounted(() => {
  //修改分页标签为中文“跳至”
  document.getElementsByClassName(
      "el-pagination__goto"
  )[0].innerText = "跳至";
  //挂载时查询本页数据
  axios.get(url, {
    params: {
      kind: "game",
      page: router.currentRoute.value.query.page
    }
  }).then((response) => {
    videoInfoList.value = response.data.records
    pagination.total = response.data.total
  })
})

function getData() {
  router.push({
    name: 'game',
    query: {
      page: pagination.currentPage
    }
  })
  axios.get(url, {
    params: {
      kind: "game",
      page: pagination.currentPage
    }
  }).then((response) => {
    videoInfoList.value = response.data.records
    pageNum = response.data.pages
  })
}

//用户手动修改url
onBeforeRouteUpdate((to, from) => {
  if (to.query.page > pageNum) {
    to.query.page = from.query.page
  }
  axios.get(url, {
    params: {
      kind: "game",
      page: to.query.page
    }
  }).then((response) => {
    videoInfoList.value = response.data.records
    pagination.total = response.data.total
  })
  pagination.currentPage = parseInt(to.query.page)
})
</script>

<style scoped>
.el-col {
  margin: 15px 0;
}

.el-image {
  transition: .2s ease-in;
}

.el-image:hover {
  filter: brightness(60%);
}

.el-card {
  border-radius: 5px;
  --el-card-padding: 0px;
  border-width: 0;
}

.el-card:hover {
  box-shadow: 2px 4px 6px;
}

.box-card p {
  margin: 10px;
  width: 94%;
  overflow: hidden;
  display: -webkit-box;
  /*文字换行4次，此后省略*/
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  word-wrap: break-word;
}

a {
  text-decoration: none;
}

#kind {
  color: #3eae7d;
}
</style>