<!--
 * @Date: 2022-11-25 18:22:48
 * @LastEditTime: 2023-02-13 12:25:26
 * @Description: 
-->
<script setup lang="ts">
import { ref } from "vue";

const reportSrc = ref("https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg");
const reportUrl = sessionStorage.getItem("reportUrl");
if (reportUrl) {
  reportSrc.value = reportUrl;
}
</script>

<template>
  <div class="view-report main-content-views">
    <van-image width="100%" fit="contain" lazy-load :src="reportSrc" />
  </div>
</template>

<style lang="scss" scoped>
.view-report {
  padding: 60px 10px;
}
</style>
