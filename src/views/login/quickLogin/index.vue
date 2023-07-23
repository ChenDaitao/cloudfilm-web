<!--
 * @Date: 2023-04-28 14:02:00
 * @LastEditTime: 2023-05-11 13:47:56
 * @Description: 快捷登录
-->
<script lang="ts" setup>
import { watch, ref } from "vue";
import { useRouter } from "vue-router";
import ShareVerify from "@/views/inspection-report/share/shareVerify/index.vue";
import useSystemStore from "@/stores/modules/system";
import { showFailToast } from "vant";
import system from "@/api/server/system";
const router = useRouter();

const systemStore = useSystemStore();

interface ParamsType {
  token: string;
  orderIdentity: string;
}

interface NormalSettings {
  verifyFlag: number;
  historyFlag: number;
}

const isShareVerify = ref<boolean>(false);
const normalSettings = ref<NormalSettings>({
  verifyFlag: 0,
  historyFlag: 0,
});

const goToInspectionReport = (options: NormalSettings) => {
  sessionStorage.setItem("normalSettings", JSON.stringify(options));
  router.push("/inspection-report");
};
const handleTokenUpdate = async (params: ParamsType) => {
  const { token } = params;
  if (token) {
    try {
      const {
        data: { code, data, message },
      } = await system.getNormalSetting(token);
      if (code !== "200") {
        showFailToast(message);
        router.push("/login");
        return;
      }
      normalSettings.value = data;
      systemStore.$patch({
        token,
      });
      sessionStorage.setItem("token", token);
      const { verifyFlag } = data;
      if (verifyFlag === 1) {
        isShareVerify.value = true;
      } else {
        goToInspectionReport(data);
      }
    } catch (error) {
      showFailToast("token已失效，请重新登录");
      router.push("/login");
    }
  } else {
    showFailToast("token不存在，请重新登录");
    router.push("/login");
  }
};

const handleVerifySuccess = () => {
  isShareVerify.value = false;
  goToInspectionReport(normalSettings.value);
};
watch(
  () => router.currentRoute.value.path,
  (toPath) => {
    console.log("toPath", toPath);
    systemStore.isQuickLogin = toPath == "/quickLogin" ? false : true;
    const queryParams = router.currentRoute.value
      .query as unknown as ParamsType;
    handleTokenUpdate(queryParams);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<template>
  <div class="quick-login">
    <van-skeleton title :row="16" class="skeleton" />
  </div>

  <!-- 校验分享码 -->
  <ShareVerify v-if="isShareVerify" @verifySuccess="handleVerifySuccess" />
</template>
<style scoped lang="scss">
.quick-login {
  .skeleton {
    margin-top: 100px;
  }
}
</style>
