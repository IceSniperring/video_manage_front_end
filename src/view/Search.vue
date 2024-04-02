<template>
  <el-container>
    <el-header>
      <h3>
        搜索<span id="keyword">{{ route.query.keyword }}</span>
      </h3>
      <h1>页数：{{ pagination.currentPage }}</h1>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col style="" :span="windowWidth<600?24:(windowWidth<1200?12:6)" v-for="(videoInfo,index) in videoInfoList"
                :key="index">
          <router-link :to="{
                name:'player',
                query:{
                  id:videoInfo.id
                }
              }">
            <el-card class="box-card">
              <el-image :src="`${inject('videoSourceUrl')}${videoInfo.postPath}`"
                        style="width: 100%"
                        alt="加载失败" :fit="'contain'" v-loading="isLoading" @load="onLoaded"/>
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
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {inject, onMounted, reactive, ref} from "vue";
import axios from "axios";

const url = inject("serverUrl") + "/api/searchVideo"
const route = useRoute()
const router = useRouter()
const videoInfoList = ref([])
let pageNum = ref(1)
let pagination = reactive({
  total: 0,
  currentPage: 1,
  disabled: false,
  pageSize: 20,
  background: true,
  small: false,
})
let isLoading = ref(true)
let onLoaded = () => {
  isLoading.value = false
}
const windowWidth = ref(document.body.clientWidth)
onMounted(async () => {
  //窗口变化触发
  window.addEventListener('resize', () => {
    windowWidth.value = document.body.clientWidth
  })
  let response = await axios.get(url, {
    params: {
      title: route.query.keyword,
      page: route.query.page
    }
  })
  videoInfoList.value = response.data.records
  pagination.total = response.data.total
  pageNum.value = response.data.pages
})

//选择页数时调用
async function getData() {
  let response = await axios.get(url, {
    params: {}
  })
  videoInfoList.value = response.data.records
}

//用户手动修改url调用
onBeforeRouteUpdate(async (to, from, next) => {
  //page大于给定页数，那么执行重定向
  if (to.query.page > pageNum.value) {
    next(false)
    await router.replace({
      name: "search",
      query: {
        page: from.query.page
      }
    })
    //重新获取数据
    pagination.currentPage = parseInt(from.query.page)
    let response = await axios.get(url, {
      params: {
        title: route.query.keyword,
        page: from.query.page
      }
    })
    videoInfoList.value = response.data.records
  } else {
    pagination.currentPage = parseInt(to.query.page)
    let response = await axios.get(url, {
      params: {
        title: to.query.keyword,
        page: to.query.page
      }
    })
    videoInfoList.value = response.data.records
    next()
  }
});

</script>
<style scoped>
#keyword {
  color: #3eae7d;
}

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
  font-size: 12px;
  margin: 10px;
  width: 90%;
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
</style>