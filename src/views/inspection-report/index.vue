<!--
 * @Date: 2023-01-30 15:25:24
 * @LastEditTime: 2023-04-30 17:09:05
 * @Description: 检查报告
-->

<template>
  <section id="check-report">
    <header>
      <div class="user-info" @click="isSelfReport = true">
        <img :src="getUserImgSrc" />
        <i>{{ headerName }}</i>
      </div>

      <div class="function-button" v-if="isPhoneLogin">
        <van-button
          round
          plain
          hairline
          size="small"
          icon-position="right"
          icon="arrow"
          @click="
            userSwitch = true;
            getMemberList();
          "
        >
          切换成员
        </van-button>
      </div>

      <div class="function-button" v-if="!isPhoneLogin && historyFlag">
        <van-button
          plain
          round
          hairline
          size="small"
          icon-position="right"
          icon="arrow"
          @click="pushNextPage('RECORD')"
        >
          检查记录
        </van-button>
      </div>
    </header>
    <main>
      <MainReportVue
        :inspectionList="inspectionList"
        :isSelfReport="isSelfReport"
      />
    </main>
    <!-- <footer class="techtips-set"><TechSustain /></footer> -->

    <!-- 切换成员 popup -->
    <van-popup
      v-model:show="userSwitch"
      position="right"
      :style="{ width: '70%', height: '100%' }"
    >
      <section class="login-person">
        <!-- <p>本人</p> -->
        <div class="menmber-item" @click="getPersonInspection(loginPerson)">
          <img :src="loginPerson.imgSrc" alt="" />
          <span>{{ loginPerson.name }}</span>
        </div>
      </section>
      <section
        class="all-members main-content-views"
        v-if="personList.length != 0"
      >
        <p>请选择已绑定的成员</p>
        <div
          class="menmber-item"
          v-for="(personItem, index) in personList"
          :key="index"
          @click="getPersonInspection(personItem)"
        >
          <img :src="personItem.imgSrc" alt="" />
          <span>{{ personItem.name }}</span>
        </div>
        <van-button type="primary" round @click="pushNextPage('ADD')">
          添加成员
        </van-button>
      </section>
      <section v-else class="all-members main-content-views">
        <h3 class="no-member">暂无绑定成员</h3>
        <van-button type="primary" round @click="pushNextPage('ADD')">
          添加成员
        </van-button>
      </section>
    </van-popup>
  </section>
</template>

<script setup lang="ts">
import OldMan from "@/assets/images/avatar/old-man.png";
import OldLady from "@/assets/images/avatar/old-lady.png";
import Woman from "@/assets/images/avatar/woman.png";
import Man from "@/assets/images/avatar/man.png";
import DefaultIcon from "@/assets/images/avatar/default-icon.png";
import Boy from "@/assets/images/avatar/boy.png";
import Girl from "@/assets/images/avatar/girl.png";

import { ref, onMounted, watch, computed } from "vue";
import MainReportVue from "@/views/inspection-report/component/MainReport.vue";
// import TechSustain from "@/components/footer/TechSustain.vue";
import router from "@/router";
import system from "@/api/server/system";
import useSystemStore from "@/stores/modules/system";
import type { InspectionType } from "@/views/inspection-report/component/type";

const systemStore = useSystemStore();

const userSwitch = ref<boolean>(false); //侧边弹窗
const headerName = ref<string>(systemStore.userInfo.name);
type Person = {
  name: string;
  relation: string;
  img: string;
  imgSrc: any; //真实图片
  idCode: string;
  consultNumber: string;
  gender: string;
  orderIdentity: string;
};
const loginPerson = computed(() => {
  const { name, gender, idCode, consultNumber, orderIdentity } =
    systemStore.selfUserInfo;
  return {
    name,
    relation: "本人",
    img: "",
    imgSrc: getImgSrc(gender),
    idCode,
    consultNumber,
    gender,
    orderIdentity,
  };
});

let personList = ref<Person[]>([]); //成员列表
const inspectionList = ref<InspectionType | null>();
const isSelfReport = ref<boolean>(true);

// 头像更换
const getUserImgSrc = computed(() => {
  const { gender } = systemStore.userInfo;
  return gender === "girl" || gender === "woman" ? Woman : Man;
});

/**
 * @description: 成员列表 检查信息
 * @param {*} person
 * @return {*}
 */
function getPersonInspection(person: Person) {
  const { orderIdentity, name } = person;
  system
    .getInspection({ orderIdentity })
    .then(({ data: { data, code } }) => {
      if (code == "200") {
        inspectionList.value = data.inspection;
        const userInfo: any = {};
        Object.keys(data).forEach((key: string) => {
          if (key != "inspection") {
            userInfo[key] = data[key];
          }
        });
        userInfo.orderIdentity = orderIdentity;
        systemStore.userInfo = userInfo;
        headerName.value = userInfo.name;
        isSelfReport.value = false;
        console.log(Object.keys(data), systemStore.userInfo, "i have a info");
      } else {
        inspectionList.value = null;
        headerName.value = name;
      }
      userSwitch.value = false;
    })
    .catch((err) => console.log(err));
}

/**
 * @description: 获取成员列表
 * @return {*}
 */
function getMemberList() {
  const { userId } = systemStore.selfUserInfo;
  system.getMemberList({ userId }).then(({ data: { data, code } }) => {
    if (code == "200") {
      data.memberList.forEach((item: Person) => {
        item.imgSrc = getImgSrc(item.img);
      });
      personList.value = data.memberList;
      console.log(personList.value, "personList");
    }
  });
}

/**
 * @description: 处理不同关系的 头像显示
 * @param {*} img
 * @return {*}
 */
const getImgSrc = (img: string) => {
  switch (img) {
    case "old-lady":
      return OldLady;
    case "old-man":
      return OldMan;
    case "woman":
      return Woman;
    case "man":
      return Man;
    case "boy":
      return Boy;
    case "girl":
      return Girl;
    case "default-icon":
      return DefaultIcon;
    default:
      return DefaultIcon;
  }
};

/**
 * @description: 处理页面路由跳转
 * @param {*} type ADD--添加成员 RECORD--检查记录
 * @return {*}
 */
function pushNextPage(type: string) {
  if (type == "ADD") {
    router.push("/personal-center/add-member");
  } else router.push("/inspection-report/history-record");
}

// const isPhoneLogin = ref<Boolean>(); //是否手机+验证码登录
const historyFlag = computed(() => systemStore.historyFlag);
const isPhoneLogin = computed(() => {
  const loginType = sessionStorage.getItem("isPhoneLogin");
  return loginType === "1";
});
onMounted(() => {
  console.log("onMounted", historyFlag.value);
  console.log("isPhoneLogin", isPhoneLogin.value);
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixin/index.scss";
@import "@/assets/css/global.scss";
#check-report {
  @include homepage-background;
  @extend .main-content-views;
  margin-top: 44px;
  padding-top: 30px;
  overflow-y: auto;
  header {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    .user-info {
      width: 180px;
      img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
      }
      i {
        font-size: 16px;
        color: #000;
        font-weight: 700;
      }
    }
    .function-button {
      .van-button {
        width: 95px;
        line-height: 3px;
        padding-right: 1px;
      }
    }
  }
  main {
    margin: 20px 0 10% 0;
  }
  footer {
    margin-bottom: 10px;
  }
}
.all-members {
  position: relative;
  height: calc(100% - 80px);
  font-size: 14px;
  padding-top: 20px;
  .menmber-item {
    height: 80px;
    width: 230px;
    line-height: 80px;
    font-size: 16px;
    font-weight: 700;
    img {
      margin-right: 6px;
      height: 60px;
      // border-radius: 50%;
    }
  }
  .van-button {
    position: absolute;
    bottom: 15px;
    width: 88%;
  }
}
.login-person {
  font-size: 14px;
  padding: 0 16px;
  .menmber-item {
    height: 80px;
    width: 230px;
    line-height: 80px;
    font-size: 16px;
    font-weight: 700;
    img {
      margin-right: 6px;
      height: 60px;
      // border-radius: 50%;
    }
  }
}
</style>
