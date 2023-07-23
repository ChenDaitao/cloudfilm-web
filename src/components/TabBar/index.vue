<!--
 * @Date: 2022-11-23 11:10:08
 * @LastEditTime: 2023-04-28 20:39:17
 * @Description: 底部导航栏组件
-->
<template>
  <section id="homepage-tab-bar">
    <div class="options">
      <div
        class="tab-item"
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ 'tab-active': activeTab === tab.name }"
        @click="onTabChange(tab)"
      >
        <van-icon :name="tab.icon" />
        <em>{{ tab.label }}</em>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import type { Router } from "vue-router";
import { ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";

const router: Router = useRouter();
const route = useRoute();

interface Tab {
  icon: string;
  label: string;
  name: string;
  navigate: string;
}

const tabs: Tab[] = [
  {
    icon: "sign",
    label: "检查报告",
    name: "inspection-report",
    navigate: "/inspection-report",
  },
  {
    icon: "contact",
    label: "个人中心",
    name: "personal-center",
    navigate: "/personal-center",
  },
];

const activeTab: Ref<string> = ref(tabs[0].name); //当前路由高亮

const onTabChange = (activeTabInfo: Tab): void => {
  activeTab.value = activeTabInfo.name;
  router.push((activeTabInfo as Tab).navigate);
};

// 监听路由状态 控制路由高亮
watchEffect(() => {
  const activeTabInfo = tabs.find(({ navigate }) =>
    route.path.includes(navigate)
  );
  if (activeTabInfo && activeTab.value !== activeTabInfo.name) {
    activeTab.value = activeTabInfo.name;
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/css/mixin/index.scss" as mainMixin;

$tab-height: 50px;

#homepage-tab-bar {
  width: 100vw;
  background: #fff;
  box-shadow: 0px 5px 10px 10px #eee;
  height: $tab-height;
  .options {
    padding: 0 9px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: $tab-height;

    @include mainMixin.with-cross-line(0.5px, 1, "bottom");
    .tab-item {
      width: 50%;
      height: 100%;
      display: inline-flex; // NOTE:
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      i {
        font-size: 24px;
      }
      em {
        font-size: 11px;
      }
    }
  }
}
.tab-active {
  color: #1286ff;
}
</style>
