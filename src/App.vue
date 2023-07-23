<template>
  <RouterView />
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
// import useStore from "@/stores/modules/user";

// onMounted(() => {
//   //在页面刷新时将vuex里的信息保存到localStorage里
//   window.addEventListener("beforeunload", () => {
//     if (useStore.userInfo) {
//       localStorage.setItem("userComMsg", JSON.stringify(useStore.userInfo));
//     }
//   });
//   //在页面加载时读取localStorage里的状态信息
//   if (localStorage.getItem("userComMsg")) {
//     Object.assign(
//       useStore.userInfo,
//       JSON.parse(localStorage.getItem("userComMsg") ?? "")
//     );
//     //使用后清除内存
//     setTimeout(function () {
//       localStorage.removeItem("userComMsg");
//     }, 300);
//   }
// });
</script>
