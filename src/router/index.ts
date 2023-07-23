/*
 * @Date: 2023-01-30 12:26:09
 * @LastEditTime: 2023-05-11 14:41:31
 * @Description:
 */
import { createRouter, createWebHistory } from "vue-router";
import { INSPECTION_REPORT } from "./inspection-report/index";
import { PERSONAL_CENTER } from "./personal-center/index";
import { getEmpty } from "@/utils/common";
import { SYSTEM } from "./system";
import LAYOUT from "@/layout/layout.vue";
import systemStore from "@/stores/modules/system";

import system from "@/api/server/system";
import { showToast } from "vant";

const BasePath = import.meta.env.BASE_URL;
const router = createRouter({
  history: createWebHistory(BasePath), //路由基础路径
  routes: [
    {
      path: "/",
      name: "Home",
      redirect: "/inspection-report",
      // redirect: "/login",
      component: LAYOUT,
      children: [], //TS类型强制
    },
    {
      path: "/login",
      name: "Login",
      meta: {
        title: "登录",
      },
      component: () => import("@/views/login/index.vue"),
    },
    {
      path: "/quickLogin",
      name: "QuickLogin",
      meta: {
        title: "登录",
      },
      component: () => import("@/views/login/quickLogin/index.vue"),
    },
    {
      path: "/inspection-report",
      name: "InspectionReport",
      redirect: "/inspection-report/homepage",
      component: LAYOUT,
      children: INSPECTION_REPORT,
    },
    {
      path: "/personal-center",
      name: "PersonalCenter",
      redirect: "/personal-center/homepage",
      component: LAYOUT,
      children: PERSONAL_CENTER,
    },
    {
      path: "/system",
      name: "System",
      redirect: "/inspection-report/homepage",
      component: LAYOUT,
      children: SYSTEM,
    },
    // {
    //   path: "/:pathMatch(.*)*",
    //   name: "NotFound",
    //   meta: {
    //     title: "Page not found",
    //   },
    //   component: () => import("@/views/error/not-found.vue"),
    // },
  ],
});

/**
 * @description: 清除store存储用户数据
 * @return {*}
 */
const storeClear = () => {
  const store = systemStore();
  store.userInfo = getEmpty(store.userInfo);
  store.selfUserInfo = getEmpty(store.selfUserInfo);
  store.includList = [];
  store.token = "";
};

/**
 * @description: 利用路由守卫 决定是否进入登录页
 * @return {*}
 */
router.beforeEach((to, from, next) => {
  const store = systemStore();
  const token = store.getToken;
  const whiteList = ["/login", "/quickLogin"];

  if (whiteList.includes(to.path)) {
    // 当回到登录页时，清除缓存
    sessionStorage.clear();
    storeClear();
    console.log(
      to.path,
      store.userInfo,
      store.selfUserInfo,
      "route.pat我已经清除缓存"
    );
    return next();
  }

  if (!token) {
    return next("/login");
  } else {
    // 处理页面刷新的情况 保持存储信息的持久性
    // 通过token 获取权限开关
    const cachedNormalSettings = sessionStorage.getItem("normalSettings");
    if (cachedNormalSettings) {
      const normalSettings = JSON.parse(cachedNormalSettings);
      store.$patch({
        ...normalSettings,
      });
    } else {
      store.getNormalSetting();
    }

    // if (store.userInfo.orderIdentity != "") return next(); //存在id直接放行 即上次登录过
    // 通过token 获取用户信息
    system.getUserInfo({ token }).then(({ data: { code, data } }) => {
      if (code === "200") {
        console.log("token查询用户信息", data);
        store.$patch({
          token: data.token,
          userInfo: data.userData,
          selfUserInfo: data.userData,
        });
        next();
      } else {
        if (code === "300") {
          store.clear();
          showToast("登录已过期，请重新登陆！");
        } else {
          showToast("暂未查询到用户信息，请重新登陆！");
        }
        next("/login");
      }
    });
  }
});

export default router;
