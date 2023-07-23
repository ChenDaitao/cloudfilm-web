<!--
 * @Date: 2023-01-30 12:21:32
 * @LastEditTime: 2023-02-08 15:00:02
 * @Description: 
-->
<template>
  <div class="login-in">
    <van-field
      class="border-top"
      v-model="loginInfo.idCode"
      left-icon="idcard"
      placeholder="请输入本人身份证号"
      type="number"
      center
    />
    <van-field
      class="border-bottom"
      v-model="loginInfo.name"
      center
      clearable
      left-icon="user-o"
      placeholder="请输入本人姓名"
    >
    </van-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UserIdCode } from "../type";

export type loginIfoIdCode = {
  loginInfo: UserIdCode;
};

const loginInfo = ref({
  idCode: "",
  name: "",
});

defineExpose({
  loginInfo,
});
</script>

<style lang="scss" scoped></style>
