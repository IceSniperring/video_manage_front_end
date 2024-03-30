<script setup>
import {useRoute} from "vue-router";

const route = useRoute()

</script>

<template>
  <h1>搜索<span id="keyword">{{ route.query.keyword }}</span>的结果</h1>
</template>

<style scoped>
#keyword {
  color: #3eae7d;
}
</style>