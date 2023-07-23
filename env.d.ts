/*
 * @Date: 2023-01-30 10:02:41
 * @LastEditTime: 2023-01-30 12:05:43
 * @Description: 声明ts无法编译类型
 */
/// <reference types="vite/client" />

// 所有vue文件导入需要加.vue后缀 否者会报错
declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const vueComponent: DefineComponent<{}, {}, any>;

  export default vueComponent;
}
