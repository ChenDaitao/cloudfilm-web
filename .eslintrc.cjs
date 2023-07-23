/*
 * @Date: 2023-01-30 10:02:41
 * @LastEditTime: 2023-01-30 12:14:47
 * @Description:
 */
/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    // 配置eslint忽略驼峰命名规则
    "vue/multi-word-component-names": "off",
  },
};
