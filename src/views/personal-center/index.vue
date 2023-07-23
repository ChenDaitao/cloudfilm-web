<!--
 * @Date: 2022-11-29 16:19:52
 * @LastEditTime: 2023-04-28 20:44:08
 * @Description: 个人中心
-->
<template>
  <section id="personal-center" :style="`height:${mainHeight}px`">
    <header>
      <img class="avatar" :src="userAvatar" alt="" />
      <div class="user-info-description">
        <span class="user-name">
          <i class="iconfont bianjijian edit-user-name">
            {{ userInfo.name }}
          </i>
          <!-- <van-icon name="records" @click="editUserName" /> -->
        </span>
        <span class="user-tel">{{ systemStore.secretPhone }}</span>
      </div>

      <!-- userinfo detail -link -->
      <router-link
        to="/personal-center/user-information"
        custom
        v-slot="{ navigate }"
      >
        <i class="iconfont user-info-detail" @click="navigate"></i>
      </router-link>
    </header>

    <main>
      <div
        class="personal-info"
        v-for="personalItem in menuList"
        :key="personalItem.label"
      >
        <!-- @click="navigate" 导航跳转 -->
        <router-link :to="personalItem.navigate" custom v-slot="{ navigate }">
          <div @click="navigate">
            <span class="icon-set">
              <van-icon :name="personalItem.icon" />
              {{ personalItem.label }}</span
            >
            <van-icon name="arrow" />
          </div>
        </router-link>
      </div>
    </main>
    <!-- <footer class="techtips-set"><TechSustain /></footer> -->
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { showToast } from "vant";
import useSystemStore from "@/stores/modules/system";
// import TechSustain from "@/components/footer/TechSustain.vue";
import manPic from "@/assets/images/avatar/man.png";
import womanPic from "@/assets/images/avatar/woman.png";
import type { PersonalInfo } from "./typing";

const systemStore = useSystemStore();
const { userInfo } = storeToRefs(systemStore);

const userAvatar = ref(manPic); //当前头像
watch(
  () => userInfo.value.gender,
  (newGender: string) => {
    if (newGender == "girl" || newGender == "woman") {
      userAvatar.value = womanPic;
      return;
    }
    userAvatar.value = manPic;
  },
  {
    immediate: true,
    deep: true,
  }
);

const menuList: PersonalInfo[] = [
  {
    icon: "manager-o",
    label: "成员管理",
    navigate: "/personal-center/member-management",
  },
  {
    icon: "question-o",
    label: "常见问题",
    navigate: "/personal-center/common-problems",
  },
  // {
  //   icon: "description",
  //   label: "操作指南",
  //   navigate: "/personal-center/description",
  // },
  // {
  //   icon: "friends-o",
  //   label: "关于我们",
  //   navigate: "/personal-center/about-us",
  // },
  {
    icon: "setting-o",
    label: "设置",
    navigate: "/personal-center/setting-management",
  },
];

const mainHeight = ref<number>(0); //处理内容自适应宽高
onMounted(() => {
  const height = window.innerHeight;
  mainHeight.value = height - 100;
  console.log(mainHeight.value, "gaou");
});
</script>

<style lang="scss" scoped>
@use "@/assets/css/var/var.scss" as mainVar;
@import "@/assets/css/mixin/index.scss";
@import "@/assets/css/global.scss";

@mixin operation-list {
  background: mainVar.$use-content-bgc;
  border-radius: 10px;
}
#personal-center {
  margin-top: 10px;
  @include homepage-background;
  @extend .main-content-views;
  margin-top: 44px;
  padding-top: 30px;
  position: relative;
  header {
    display: flex;
    position: relative;
    align-items: center;
    img {
      height: mainVar.$avatar-size;
    }
    .user-info-description {
      color: #333;
      height: mainVar.$avatar-size;
      margin-left: 10px;
      display: inline-flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 20px;
      .edit-user-name {
        font-weight: 600;
        font-size: 16px;
        margin-right: 5px;
        cursor: pointer;
      }
      .user-tel {
        font-size: 14px;
      }
    }
    .user-info-detail {
      font-size: 22px;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, 50%);
    }
  }
  main {
    margin-top: 36px;
    margin-bottom: 30%; //TODO:处理说明显示自适应靠下
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    .personal-info {
      @include operation-list;
      > div {
        @include main-content;
        height: 52px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon-set {
          display: inline-flex;
          align-items: center;
          .van-icon {
            font-size: 20px;
            font-weight: 500;
            margin-right: 8px;
          }
        }
      }
    }
  }
  footer {
    position: absolute;
    bottom: 10px;
    padding-right: 18px;
  }
}

.edit-field {
  width: 160px;
  line-height: 0px;
  margin: 20px auto;
  border: 1px solid #ccc;
}
</style>
