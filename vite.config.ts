/*
 * @Date: 2023-01-30 10:02:41
 * @LastEditTime: 2023-05-10 13:58:06
 * @Description:
 */
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import pxtoViewPort from "postcss-px-to-viewport"; //此处引入 外部需要声明postcss-px-to-viewport TS类型

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  // 配置postcss-px-to-viewport
  css: {
    postcss: {
      plugins: [
        pxtoViewPort({
          unitToConvert: "px", // 要转化的单位
          viewportWidth: 375, // 视口宽度, 对应的时设计稿的宽度需要/2,(一般设计稿的宽度为750，对应iPhone6的宽度)
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ["ignore-"], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          exclude: [], // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          landscape: false, // 是否处理横屏情况
        }),
      ],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0", //解决 Network: use --host to expose
    proxy: {
      "/api": {
        // target: "http://169.254.166.44:11100/",
        target: "http://120.79.236.70:8080",
        // target: "http://localhost:8081", //本地mock
        changeOrigin: true,
        // rewrite: (path: string) => path.replace(/^\/api/, ""),
        //  (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
