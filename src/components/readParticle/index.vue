<!--
 * @Date: 2023-01-30 14:11:50
 * @LastEditTime: 2023-04-19 22:35:23
 * @Description: 
-->
<template>
  <div class="readme">
    <van-checkbox icon-size="14px" v-model="isAgree">
      <span>我已经阅读并同意</span>
      <i @click="showUserLicense = true">《云电子胶片使用协议》</i>
    </van-checkbox>
    <span @click="showWidthProblem = true">遇见问题?</span>
    <!-- 使用协议主要内容popup NOTE:  -->
    <van-popup
      v-model:show="showUserLicense"
      round
      position="bottom"
      :style="{ height: '60%' }"
    >
      <UseLicense />
    </van-popup>

    <!-- 遇见问题主要内容dialog -->
    <van-dialog
      v-model:show="showWidthProblem"
      title="收不到短信？"
      show-cancel-button
      confirmButtonColor="#1286ff"
    >
      <ProblemTip />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import ProblemTip from "./ProblemTip/index.vue";
import UseLicense from "./useLicense/index.vue";
import { ref, watch } from "vue";

const showUserLicense = ref<boolean>(false);
const showWidthProblem = ref<boolean>(false);
const isAgree = ref<boolean>(false);

const emits = defineEmits(["isSetLicense"]);

/**
 * @description: 勾选时向外部传值
 * @return {*}
 */
const isSetLicense = () => {
  emits("isSetLicense", isAgree.value);
};

watch(isAgree, () => {
  isSetLicense();
});
</script>

<style scoped lang="scss">
@use "@/assets/css/var/var.scss" as mainVar;
.readme {
  margin-top: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 8px;
  color: mainVar.$color-tips;
  i,
  > span {
    color: mainVar.$color-active;
  }
}
</style>
