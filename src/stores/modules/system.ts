/*
 * @Date: 2022-11-23 15:35:57
 * @LastEditTime: 2023-04-30 15:54:11
 * @Description: System
 */
import { defineStore } from "pinia";
import type { SystemState } from "./type";
import system from "@/api/server/system";
import { showToast } from "vant";

const systemStore = defineStore("system-store", {
  // id: "system-store",
  state: (): SystemState => ({
    token: "",
    isShare: false, // 是否是分享进入的
    historyFlag: 1, // 是否显示历史记录
    verifyFlag: 1, // 是否显示验证码
    includList: [],
    isQuickLogin: true, //扫码登录时 不显示下载和分享功能
    selfUserInfo: {
      phone: "",
      msgCode: "",
      consultNumber: "",
      idCode: "",
      name: "",
      gender: "",
      orderIdentity: "",
      userId: "",
    }, //保存手机号自身信息
    userInfo: {
      phone: "",
      msgCode: "",
      consultNumber: "",
      idCode: "",
      name: "",
      gender: "",
      orderIdentity: "",
      userId: "",
    }, //用户信息
  }),
  getters: {
    cachedViews(): string[] {
      return this.includList;
    },
    hadToken(): boolean {
      const cacheToken = sessionStorage.getItem("token");
      return Boolean(this.token || cacheToken);
    },
    getToken(): string {
      const cacheToken = sessionStorage.getItem("token")!;
      return this.token || cacheToken;
    },
    // 手机号脱敏显示
    secretPhone() {
      const { phone } = this.userInfo;
      const phoneSecret: string = phone.replace(
        /^(.{3})(?:\d+)(.{4})$/,
        "$1****$2"
      );
      return phoneSecret;
    },
  },
  actions: {
    async getNormalSetting() {
      try {
        const {
          data: { code, message, data },
        } = await system.getNormalSetting(this.getToken);
        if (code === "200") {
          this.$patch({
            ...data,
          });
          sessionStorage.setItem("normalSettings", JSON.stringify(data));
        } else {
          showToast(message);
        }
      } catch (error) {
        showToast("获取系统配置失败，请稍后重试！");
      }
    },
    clear() {
      this.$patch({
        token: "",
      });
      sessionStorage.clear();
    },
    // getUserInfo() {
    //   return new Promise<number>((resolve, reject) => {
    //     if (!this.hadToken) reject(0);
    //     const token = this.getToken;
    //     system.getUserInfo({ token }).then(({ data: { code, data } }) => {
    //       // console.log("res", res);
    //       if (code === "200") {
    //         console.log("res", data);
    //         this.$patch({
    //           token: data.token,
    //           userInfo: data[LoginWay.PHO],
    //           selfUserInfo: data[LoginWay.PHO],
    //         });
    //         resolve(1);
    //       } else {
    //         showToast("暂未查询到用户信息，请重新登陆！");
    //         reject(0);
    //       }
    //     });
    //   });
    // },
  },
});

export default systemStore;
