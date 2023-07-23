<!--
 * @Date: 2023-01-30 12:08:28
 * @LastEditTime: 2023-04-30 15:03:11
 * @Description:
-->
<template>
  <section id="login" class="main-content-views">
    <header>
      <div class="">
        <img src="@/assets/images/logo.png" alt="" />
        <h3>欢迎使用{{ title }}</h3>
      </div>
    </header>
    <main>
      <PhoneTell ref="phoneTellRef" v-if="loginRef === 'PHO'" />
      <IdentidyCode ref="IdCodeRef" v-if="loginRef === 'IDC'" />
      <ConsultNumber ref="consultRef" v-if="loginRef === 'CN'" />
      <van-button
        round
        type="primary"
        size="small"
        class="login-button"
        @click="loginConfirm"
      >
        登录
      </van-button>
      <ReadParticle @isSetLicense="isSetLicense" class="readme" />
    </main>
    <footer>
      <div class="title">其他登录方式</div>
      <div class="use-switch-login">
        <span
          class="login-PHO"
          @click="loginRef = LoginWay.PHO"
          v-if="loginPHO"
        >
          <div>
            <img class="iconfont" src="@/assets/images/phone.svg" alt="" />
          </div>
          <em>手机号</em>
        </span>
        <span
          class="login-IDC"
          @click="loginRef = LoginWay.IDC"
          v-if="loginIDC"
        >
          <div>
            <img class="iconfont" src="@/assets/images/id-card.svg" alt="" />
          </div>
          <em>身份证</em>
        </span>
        <span class="login-CN" @click="loginRef = LoginWay.CN" v-if="loginCN">
          <div>
            <img class="iconfont" src="@/assets/images/jiuzhen.svg" alt="" />
          </div>
          <em>就诊号</em>
        </span>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import system from "@/api/server/system";
import PhoneTell from "./waysToLogin/PhoneTell.vue";
import type { LoginInfoPhone } from "./waysToLogin/PhoneTell.vue";
import IdentidyCode from "./waysToLogin/IdentidyCode.vue";
import type { loginIfoIdCode } from "./waysToLogin/IdentidyCode.vue";
import ConsultNumber from "./waysToLogin/ConsultNumber.vue";
import type { LoginInfoCNumber } from "./waysToLogin/ConsultNumber.vue";
import ReadParticle from "@/components/readParticle/index.vue";
import { LoginWay } from "@/enums/userEnums";
import { title } from "@/setting";
import useSystemStore from "@/stores/modules/system";
import { ref, computed } from "vue";
import router from "@/router";
import { showToast } from "vant";

const systemStore = useSystemStore();

const loginRef = ref<string>("PHO");
const loginPHO = computed(() => {
  return loginRef.value !== LoginWay.PHO;
});
const loginIDC = computed(() => {
  return loginRef.value !== LoginWay.IDC;
});
const loginCN = computed(() => {
  return loginRef.value !== LoginWay.CN;
});

const phoneTellRef = ref<LoginInfoPhone | null>(null);
const IdCodeRef = ref<loginIfoIdCode | null>(null);
const consultRef = ref<LoginInfoCNumber | null>(null);

const isAgreeUserLicense = ref<boolean>(false); //勾选协议权限 默认未勾选

/**
 * @description:接收子组件状态传值
 * @param {*} status
 * @return {*}
 */
const isSetLicense = (status: boolean) => {
  isAgreeUserLicense.value = status;
};

/**
 * @description: 登陆状态设置
 * @param {*} ref
 * @param {*} loginWay
 * @return {*}
 */
const loginInputStatus = (ref: any, loginWay: string) => {
  let topValue = "";
  let bottomValue = "";
  if (loginWay == LoginWay.PHO) {
    const { msgCode, phone } = ref.loginInfo;
    topValue = phone;
    bottomValue = msgCode;
  } else if (loginWay == LoginWay.CN) {
    const { consultNumber, name } = ref.loginInfo;
    topValue = consultNumber;
    bottomValue = name;
  } else {
    const { idCode, name } = ref.loginInfo;
    topValue = idCode;
    bottomValue = name;
  }
  return topValue && bottomValue;
};

/**
 * @description: 处理协议是否选中
 * @param {*} ref
 * @param {*} loginWay
 * @return {*}
 */
const loginSet = (ref: any, loginWay: string) => {
  const isInput = loginInputStatus(ref, loginWay);
  if (isInput) {
    if (isAgreeUserLicense.value) {
      const param = {
        ...ref.loginInfo,
        loginWay: loginWay,
      };
      loginIn(param, loginWay);
    } else showToast("请勾选同意用户使用协议！");
  } else showToast("请输入完整身份信息！");
};
/**
 * @description: 处理登录请求
 * @param {*} param
 * @param {*} loginWay
 * @return {*}
 */
const loginIn = (param: any, loginWay: string) => {
  system.login(param).then(({ data: { data, code, message } }: any) => {
    if (code == "200") {
      showToast(message);
      console.log("登录时", data);

      systemStore.$patch({
        token: data.token,
        // userInfo: data.userData,
        // selfUserInfo: data.userData,
      });
      sessionStorage.setItem("token", data.token);
      const loginType = loginWay == LoginWay.PHO ? "1" : "0";
      window.sessionStorage.setItem("isPhoneLogin", loginType);

      router.push("/inspection-report");
    } else showToast(message);
  });
};

/**
 * @description: 登录
 * @return {*}
 */
function loginConfirm() {
  if (loginRef.value == LoginWay.PHO && phoneTellRef.value) {
    loginSet(phoneTellRef.value, LoginWay.PHO);
  } else if (loginRef.value == LoginWay.CN && consultRef.value) {
    loginSet(consultRef.value, LoginWay.CN);
  } else if (loginRef.value == LoginWay.IDC && IdCodeRef.value) {
    loginSet(IdCodeRef.value, LoginWay.IDC);
  }
}
</script>

<style lang="scss">
.login-button {
  width: 85%;
  margin-top: 10px;
}
</style>
<style lang="scss" scoped>
@use "@/assets/css/mixin/index.scss" as mainMixin;
@use "@/assets/css/var/var.scss" as mainVar;
#login {
  padding: 70px 30px;
  text-align: center;
  header {
    img {
      max-width: 90%;
      height: 100px;
    }
    h3 {
      font-size: 24px;
      letter-spacing: 1px;
    }
  }
  main {
    margin-top: 50px;
    .van-button {
      margin: 15px 0 10px 0;
    }
  }
  footer {
    @include mainMixin.with-cross-line(1px, 0 "top");
    position: relative;
    top: 70px;
    .title {
      padding-bottom: 15px;
      text-align: center;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      width: 150px;
      color: mainVar.$color-small-tips;
      font-weight: 600;
    }
    .use-switch-login {
      display: flex;
      justify-content: space-evenly;
      height: 100px;
      > span {
        display: block;
        margin: auto 0; //处理圆圈居中
        width: 52px;
        height: 52px;
        line-height: 50px;
        border: 1px solid #ddd;
        border-radius: 50%;
        .iconfont {
          width: 35px;
          height: 35px;
        }
        // padding: 30px 0 20px;
        // i {
        //   width: 24px;
        //   height: 24px;
        // }
      }
    }
  }
}
</style>
