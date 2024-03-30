<template>
  <el-container>
    <el-header>
      <h2>
        分类：
        <span style="font-size: 16px">vue3学习</span>
      </h2>
    </el-header>
    <el-main>
      <h1>页数{{ router.currentRoute.value.query.page }}</h1>
      <el-row :gutter="20">
        <el-col style="" :span="6" v-for="(src,index) in srcList" :key="index">
          <router-link :to="{
                name:'player',
                query:{
                  title: (index+1).toString()
                }
              }">
            <el-card class="box-card">
              <el-image :src="src"
                        style="width: 100%"
                        alt="加载失败" :fit="'contain'"/>
              <p>Vue课程（{{ index + 1 }}）</p>
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
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()
let pagination = reactive({
  total: 70,
  currentPage: parseInt(router.currentRoute.value.query.page),
  disabled: false,
  pageSize: 20,
  background: true,
  small: false,
})
const pageNumTemp = pagination.total / pagination.pageSize
const pageNum = Number.isInteger(pageNumTemp) ? pageNumTemp : Math.round(pageNumTemp)
const srcNum = 70
let srcList = ref([])

onMounted(() => {
  //修改分页标签为中文“跳至”
  document.getElementsByClassName(
      "el-pagination__goto"
  )[0].innerText = "跳至";

  for (let i = 1; i <= pagination.pageSize; i++) {
    srcList.value.push(`/vue_video/image/Vue3尚硅谷 (${i}).jpg`)
  }
})

function pageQuery(current, size) {
  srcList.value = []
  for (let i = current; i < size + current; i++) {
    srcList.value.push(`/vue_video/image/Vue3尚硅谷 (${i}).jpg`)
  }
}

function getData(val = 1) {
  srcList.current = val
  pageQuery(pagination.currentPage, pagination.pageSize)
  router.push({
    name: 'vue3Learn',
    query: {
      page: pagination.currentPage
    }
  })
  console.log(pagination.currentPage)
}


//修改url的后果
router.beforeEach((to, from) => {
  if (to.name === 'vue3Learn') {
    if (!to.query.hasOwnProperty("page")) {
      to.query.page = "1"
    }
    if (to.query.page > pageNum) {
      to.query.page = from.query.page
    }
  }
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
</style>