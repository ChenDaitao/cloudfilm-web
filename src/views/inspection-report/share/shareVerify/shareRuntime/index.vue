<!--
 * @Date: 2023-02-04 10:29:20
 * @LastEditTime: 2023-02-13 11:43:41
 * @Description: 分享过期
-->
<template>
  <div id="share-runtime" class="main-content-views">
    <img src="@/assets/images/stale-dated.png" alt="" />
    <div class="tips">该分享已过期，无法查看报告</div>
    <van-button type="primary" round>去登录</van-button>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
#share-runtime {
  text-align: center;
  img {
    width: 100%;
    margin-top: 50px;
  }
  .tips {
    width: 100%;
    margin: 10px 0 20px 0;
    color: #888;
  }
  .van-button {
    width: 80%;
  }
}
</style>
