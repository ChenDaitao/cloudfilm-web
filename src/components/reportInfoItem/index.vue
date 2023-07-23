<!--
 * @Date: 2022-11-29 14:33:45
 * @LastEditTime: 2023-02-05 22:48:38
 * @Description: 处理报告单 单条数据显示
-->
<template>
  <div :style="{ minWidth: props.width, padding: props.padding }">
    <span class="label">{{ props.labelText }}:</span>
    <span class="content"><slot></slot></span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  labelText: string;
  width?: number | string;
  padding?: string;
  labelWidth?: number;
}
const props = withDefaults(defineProps<Props>(), {
  labelText: "",
  width: "50%",
  padding: "3px 15px",
});
</script>

<style lang="scss" scoped>
div {
  display: inline-block;
  font-size: 14px;
  .label {
    padding-right: 4px;
    color: #888888;
  }
  .content {
    color: #333;
    font-size: 14px;
    word-wrap: break-word; /*  长单词或地址内换行*/
    word-break: break-all; /* 任意字符间断行 */
  }
}
</style>
