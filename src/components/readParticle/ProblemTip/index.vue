<template>
  <div>
    <h5 class="title">关于短信验证码</h5>
    <h5>1、首先请确认手机是否停机、或者设置了短信拦截</h5>
    <h5>2、如果没有设置短信拦截, 同时也没有停机, 请重启手机后尝试</h5>
    <h5>3、短信可能存在一定的延迟, 有时候需要耐心等待</h5>
    <h5>4、如果以上操作都不行, 请将 SIM 卡更换手机, 然后重试</h5>
    <h5>
      如果您的手机号无法正常使用, 不能接收验证码,
      请到医院咨询医务人员修改手机号。
    </h5>
    <h5 class="title">其他</h5>
    <h5>请确认个人信息准确无误，如若无法登录请咨询相关医务人员核对就诊信息</h5>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/assets/css/mixin/index.scss";
div {
  text-align: left;
  font-family: songti;
  @include main-content;
  padding: 10px 20px;
  .title {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 5px;
  }
}
</style>
