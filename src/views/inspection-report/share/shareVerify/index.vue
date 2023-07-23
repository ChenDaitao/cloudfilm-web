<!--
 * @Date: 2023-02-04 10:01:25
 * @LastEditTime: 2023-05-11 13:46:23
 * @Description: 分享授权
-->
<template>
  <TabHeader tabHeader="分享验证码" :isShowBack="false" class="tab-header" />
  <div class="main-content-views">
    <van-password-input
      :value="codeValue"
      :info="tips"
      length="4"
      :error-info="errorInfo"
      :focused="showKeyboard"
      @focus="showKeyboard = true"
    />
    <van-number-keyboard
      v-model="codeValue"
      :show="showKeyboard"
      @blur="showKeyboard = false"
    />
  </div>
</template>

<script setup lang="ts">
import TabHeader from "@/components/tabHeader/index.vue";
import system from "@/api/server/system";
import { ref, onMounted, watch } from "vue";

const emit = defineEmits(["verifySuccess"]);

// const tabHeader = ref<string>("分享验证码"); //设置头部标题栏处理

const codeValue = ref("");
const tips = ref("");
const errorInfo = ref("");
const showKeyboard = ref(true);

watch(codeValue, (newVal) => {
  if (newVal.length === 4) {
    handleCodeVerify(newVal);
  } else {
    errorInfo.value = "";
  }
});
/**
 * @description: 授权密码验证
 * @return {*}
 */
async function handleCodeVerify(verifyCode: string) {
  try {
    const {
      data: { code, message },
    } = await system.shareVerify({ code: verifyCode });
    if (code === "200") {
      tips.value = "校验成功！";
      emit("verifySuccess");
    } else {
      // showToast(message);
      errorInfo.value = message;
      // nextTick(() => {
      //   codeValue.value = "";
      // });
    }
  } catch (error) {
    // showToast("授权码错误，请重试！");
    errorInfo.value = "授权码错误，请重试！";
    codeValue.value = "";
  }
}

onMounted(() => {
  // const defaultShare = {
  //   shareType: "1", //1 pc分享 2二维码分享
  //   timeLimit: "",
  //   needPwd: true,
  //   pwd: "",
  //   hasHistory: false,
  // };
  // // 获取授权密码
  // const { pwd } = defaultShare;
  // shareVerfyCode.value = pwd;
});
</script>

<style lang="scss" scoped>
/* @use "@/assets/css/mixin/index.scss" as mainMixin; */
$tab-height: 48px;

.tab-header {
  position: fixed;
  top: 0;
}
.main-content-views {
  position: fixed;
  top: $tab-height;
  left: 0;
  width: 100vw;
  z-index: 100;
}
</style>
