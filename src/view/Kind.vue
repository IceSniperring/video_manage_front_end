<template>
  <el-container>
    <el-header>
      <h3>
        🗂️分类：
        <span style="font-size: 22px" id="kind">{{ route.query.type }}</span>
      </h3>
      <h1>📖页数：{{ pagination.currentPage }}</h1>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col style="" :span="6" v-for="(videoInfo,index) in videoInfoList" :key="index">
          <router-link :to="{
                name:'player',
                query:{
                  id:videoInfo.id
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
      <el-row justify="center">
        <el-col :span="8" :offset="3" style="justify-content: center;display: flex">
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
  <el-backtop :right="20" :bottom="20"/>
</template>

<script setup>
import {inject, onBeforeMount, onMounted, reactive} from "vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {useVideoData} from "@/hooks/useVideoData.js";

const router = useRouter()
const route = useRoute()

const serverUrl = inject("serverUrl");
//调用hooks获取必要数据
const {videoInfoList, pageNum, total, fetchVideoData} = useVideoData(serverUrl);
let pagination = reactive({
  total: total,
  currentPage: 1,
  disabled: false,
  pageSize: 20,
  background: true,
  small: false,
})

console.log(videoInfoList)
onBeforeMount(() => {
  fetchVideoData(route.query.type, route.query.page);
});

onMounted(() => {
  document.getElementsByClassName("el-pagination__goto")[0].innerText = "跳至";
});

function getData() {
  router.push({
    name: "kind",
    query: {
      type: route.query.type,
      page: pagination.currentPage
    }
  });
  fetchVideoData(route.query.type, pagination.currentPage);
}

onBeforeRouteUpdate((to, from, next) => {
  //page大于给定页数，那么执行重定向
  if (to.query.page > pageNum.value) {
    next(false)
    router.replace({
      name: "kind",
      query: {
        kind: from.query.type,
        page: from.query.page
      }
    })
    //重新获取数据
    pagination.currentPage = parseInt(from.query.page)
    fetchVideoData(from.query.type, from.query.page);
  } else {
    pagination.currentPage = parseInt(to.query.page)
    fetchVideoData(to.query.type, to.query.page);
    next()
  }
});
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