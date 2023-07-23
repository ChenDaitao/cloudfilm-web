<!--
 * @Date: 2023-02-03 14:03:54
 * @LastEditTime: 2023-02-04 20:35:26
 * @Description: 
-->
<template>
  <div class="login-in">
    <van-field
      class="border-top"
      v-model="loginInfo.consultNumber"
      left-icon="shield-o"
      placeholder="请输入就诊号"
      type="number"
      center
    />
    <van-field
      class="border-bottom"
      v-model="loginInfo.name"
      center
      clearable
      left-icon="user-o"
      placeholder="请输入就诊姓名"
    >
    </van-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UserCN } from "../type";

export type LoginInfoCNumber = {
  loginInfo: UserCN;
};

const loginInfo = ref({
  consultNumber: "",
  name: "",
});

defineExpose({
  loginInfo,
});
</script>

<style lang="scss"></style>
