<template>
  <div id="modify-phone" class="main-content-views">
    <div class="info-tips">为了保障您的账号安全，更换手机号需要验证身份</div>
    <span>当前手机号：{{ systemStore.secretPhone }}</span>
    <van-field
      class="send-code-van-field"
      v-model="messageCode"
      placeholder="请输入短信验证码"
    >
      <template #button>
        <van-button
          v-if="isStop"
          size="small"
          round
          type="primary"
          class="send-code-button"
          @click="start"
        >
          获取验证码
        </van-button>
        <van-button
          v-else
          size="small"
          round
          type="primary"
          class="send-code-button"
        >
          重新获取 {{ timeCount }}s
        </van-button>
      </template>
    </van-field>
    <van-button class="next-button" type="primary" round @click="nextPage">
      下一步
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
import { ref, watch } from "vue";
import useSystemStore from "@/stores/modules/system";
import system from "@/api/server/system";
import ProblemTip from "@/components/readParticle/ProblemTip/index.vue";
import { countingDown } from "@/hook/countingDown";
import router from "@/router";
import { showFailToast, showSuccessToast, showToast } from "vant";

const systemStore = useSystemStore();

const { timeCount, isStop, start } = countingDown(); //mixin引入计时hook

const showWidthProblem = ref<boolean>(false); //遇见问题弹窗显示
const messageCode = ref<string>(""); //保存短信验证码

/**
 * @description: 跳转绑定手机号页面
 * @return {*}
 */
function nextPage() {
  if (messageCode.value.length == 0) {
    showToast("请填写短信验证码");
    return;
  }
  system
    .getPhoneModify({ msgCodeVerify: messageCode.value })
    .then(({ data: { code, message } }) => {
      if (code == "200") {
        showSuccessToast(message);
        router.push("/system/binding-phone");
      } else {
        messageCode.value = "";
        showFailToast(message);
      }
    })
    .catch((err) => console.log(err));
}

watch(
  timeCount,
  (newTime) => {
    if (newTime == 54) {
      messageCode.value = "778965"; //mock 验证码输入
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss">
.next-button {
  width: 100%;
  margin: 15px 0;
}
.problem-info {
  text-align: center;
}
</style>
<style lang="scss" scoped>
#modify-phone {
  .info-tips {
    font-size: 12px;
    margin: 20px 0;
  }
  span {
    font-size: 14px;
  }
  .van-field {
    margin-top: 10px;
  }
}
</style>
