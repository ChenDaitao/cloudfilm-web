<!--
 * @Date: 2023-02-04 10:42:26
 * @LastEditTime: 2023-02-13 11:41:41
 * @Description: 无报告显示
-->
<template>
  <div id="widthout-report" class="main-content-views">
    <img src="@/assets/images/stale-dated.png" alt="" />
    <div class="tips">暂未查询到报告，请稍后重试</div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
#widthout-report {
  text-align: center;
  img {
    width: 100%;
  }
  .tips {
    width: 100%;
    margin: 10px 0 20px 0;
    color: #888;
    font-size: 14px;
    margin-top: 50px;
  }
}
</style>
