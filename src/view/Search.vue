<script setup>
import {useRouter} from "vue-router";

const route = useRouter()

</script>

<template>
  <h1>搜索<span id="keyword">{{ route.currentRoute.value.query.keyword }}</span>的结果</h1>
</template>

<style scoped>
#keyword {
  color: #3eae7d;
}
</style>