<template>
  <h1>🏡主页</h1>
  <el-container>
    <el-main>
      <el-row id="carousel">
        <el-col :span="24">
          <el-carousel motion-blur>
            <el-carousel-item v-for="item in 4" :key="item">
              <router-link :to="{
								 name:'player',
                 query: {
                    title: item.toString()
                }
							}">
                <el-image :src="`/vue_video/image/Vue3尚硅谷 (${item}).jpg`"
                          style="width: 100%;"/>
              </router-link>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-for="i in 4" :span="6">
          <router-link :to="{
								 name:'player',
                 query: {
                    title: i.toString()
                }
							}">
            <el-card class="box-card">
              <el-image :src="`/vue_video/image/Vue3尚硅谷 (${i}).jpg`"
                        alt="加载失败" :fit="'scale-down'"/>
              <p style="margin-left: 5px">Vue3尚硅谷 ({{ i }})</p>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>

</script>

<style scoped>
h1 {
  font-size: 25px;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

#carousel {
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 2px 4px 6px;
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


a {
  text-decoration: none;
}
</style>