<!--
 * @Date: 2022-11-23 10:44:29
 * @LastEditTime: 2023-02-25 19:55:45
 * @Description: 
-->
<template>
  <router-view>
    <template #default="{ Component, route }">
      <keep-alive :include="cachedViews" :max="10">
        <component
          class="container"
          :is="Component"
          :key="route.fullPath"
          :style="componentStyle"
        />
      </keep-alive>
    </template>
  </router-view>
  <!-- 头部标题 -->
  <TabHeader :tabHeader="tabHeader" class="tab-header" />
  <!-- 底部操作 -->
  <TabBar class="tab-bar" ref="tabBarRefs" v-if="showTabBar" />
</template>

<script setup lang="ts">
import TabBar from "@/components/TabBar/index.vue";
import TabHeader from "@/components/tabHeader/index.vue";
import { storeToRefs } from "pinia";
import useSystemStore from "@/stores/modules/system";
import { computed, reactive, ref, watchEffect, watch, nextTick } from "vue";
import { useRoute, type RouteLocationNormalizedLoaded } from "vue-router";

const systemStore = useSystemStore();
const { cachedViews, hadToken } = storeToRefs(systemStore);

const tabHeader = ref<string>(""); //设置头部标题栏处理

const route = useRoute();

/* 监听路由 判断tab-bar是否显示 */
// some 检测数组中是否有元素 检测到则返回true 不再向下执行
// find 返回通过检测的第一个元素值  不再向下执行
const ACCESS_PATH = ["/personal-center", "/inspection-report"];
const mainPageInside = ref(true);
watchEffect(() => {
  const { path: routPath, meta } = route as RouteLocationNormalizedLoaded;
  tabHeader.value = meta.title as string;
  console.log(tabHeader.value, "tabHeader.value ");
  const inRule: boolean = ACCESS_PATH.some((path) => routPath.includes(path));
  mainPageInside.value = inRule ? Boolean(meta?.showTabBar) : inRule;
});
const showTabBar = computed(() => {
  return (
    mainPageInside.value &&
    hadToken.value &&
    window.sessionStorage.getItem("isPhoneLogin") === "1"
  );
});

/* 控制component高度 */
const fullHeight = "100vh";

const componentStyle = reactive({
  height: "",
  marginBottom: "",
});

const tabBarRefs = ref<InstanceType<typeof TabBar> | null>(null);

watch(
  showTabBar,
  async (display) => {
    await nextTick(); //需要更新DOM
    let tabHeight = "";
    if (tabBarRefs.value) {
      tabHeight = (tabBarRefs.value.$el?.clientHeight || 0) + "px";
    }
    componentStyle.height = display
      ? `calc(${fullHeight}-${tabHeight})`
      : `${fullHeight}`;

    componentStyle.marginBottom = display ? `${tabHeight}` : "";
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
// @import "@/assets/css/var.scss";
@use "@/assets/css/var/var.scss" as mianVar; //使用use as重命名增加可读性
.container {
  width: 100%;
  overflow-y: auto;
  background-color: mianVar.$default-content-bgc;
  font-family: PingFang SC-Medium;
  color: mianVar.$color-pTitle-tips;
  box-shadow: 0px 6px 35px 6px rgba(154, 149, 149, 0.87);
  -webkit-box-shadow: 0px 6px 35px 6px rgba(154, 149, 149, 0.87);
  -moz-box-shadow: 0px 6px 35px 6px rgba(154, 149, 149, 0.87);
}
.tab-header {
  position: fixed;
  top: 0;
}
.tab-bar {
  position: fixed;
  bottom: -1px;
}
</style>
