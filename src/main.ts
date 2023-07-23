import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import "./assets/css/index.scss";
import "vant/lib/index.css";
import vantRegester from "@/utils/vant-install";
import mitt from "mitt";
import { store } from "@/stores/index";

const Mit = mitt();
const app = createApp(App);

// 声明获取$Bus提示
declare module "vue" {
  export interface ComponentCustomProperties {
    $Bus: typeof Mit;
  }
}

app.config.globalProperties.$Bus = Mit;

vantRegester(app); //注册vant组件

app.use(store).use(router);
app.mount("#app");
