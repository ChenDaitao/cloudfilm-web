<!--
 * @Date: 2023-02-02 11:43:55
 * @LastEditTime: 2023-04-19 22:32:03
 * @Description:  
-->
<template>
  <div class="main-content-views" id="binding-phone">
    <h4>请绑定新的手机号</h4>
    <GetMsgCode ref="getMsgCodeRef" />
    <van-button
      class="next-button"
      type="primary"
      round
      @click="confirmBinding"
    >
      确定
    </van-button>
    <div class="problem-info" @click="showWidthProblem = true">遇到问题？</div>

    <!-- 遇见问题 popup -->
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

<script lang="ts" setup>
import { ref } from "vue";
import type { LoginInfoPhone as GetMsgCodeRef } from "@/views/login/waysToLogin/PhoneTell.vue";
import GetMsgCode from "@/views/login/waysToLogin/PhoneTell.vue";
import ProblemTip from "@/components/readParticle/ProblemTip/index.vue";
import { showFailToast, showSuccessToast, showToast } from "vant";
import system from "@/api/server/system";
import useSystemStore from "@/stores/modules/system";
import router from "@/router";

const systemStore = useSystemStore();

const showWidthProblem = ref<boolean>(false); //遇见问题弹窗显示
const getMsgCodeRef = ref<GetMsgCodeRef | null>(null); //处理组件ref

/**
 * @description: 确定绑定时
 * @return {*}
 */
function confirmBinding() {
  if (
    getMsgCodeRef.value?.loginInfo.msgCode &&
    getMsgCodeRef.value?.loginInfo.msgCode
  ) {
    const params = {
      orderIdentity: systemStore.selfUserInfo.orderIdentity,
      ...getMsgCodeRef.value?.loginInfo,
    };
    system
      .getBindingPhone(params)
      .then(({ data: { code, message } }) => {
        if (code == "200") {
          showSuccessToast(message);
          router.push("/login");
          systemStore.token = "";
        } else showFailToast(message);
      })
      .catch((err) => console.log(err));
  } else {
    showToast("请填写完整信息");
  }
}
</script>

<style lang="scss" scoped>
#binding-phone {
  margin-top: 10px;
  h4 {
    padding: 10px;
  }
}
</style>
