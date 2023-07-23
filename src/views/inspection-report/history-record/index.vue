<!--
 * @Date: 2023-02-03 14:03:54
 * @LastEditTime: 2023-04-28 20:58:00
 * @Description: 检查记录
-->
<template>
  <div id="history-record">
    <section class="drop-down-menu">
      <van-dropdown-menu @close="whenClose">
        <van-dropdown-item title="日期" ref="dropdownItemRef">
          <div class="date-button">
            <van-button class="year" @click="isYear = true">按年</van-button>
            <van-button class="month" @click="isYear = false">按月</van-button>
          </div>
          <div class="date-picker-set">
            <van-date-picker
              v-model="dateContent.currentDate"
              :min-date="dateContent.minDate"
              :max-date="dateContent.maxDate"
              :columns-type="dateContent.columnsType"
              :show-toolbar="false"
            />
            <div class="func-button">
              <!-- <van-button @click="isShowMenu = false">取消</van-button> -->
              <van-button type="primary" @click="dateConfirm">确定</van-button>
            </div>
          </div>
        </van-dropdown-item>
        <van-dropdown-item
          title="科室"
          v-model="sectionVal"
          :options="sectionOption"
        />
      </van-dropdown-menu>
    </section>
    <section
      class="history-content"
      v-for="inspectionItem in inspectionList"
      @click="lookInspection(inspectionItem)"
      :key="inspectionItem.img"
    >
      <div class="content-title">
        <span>{{ inspectionItem.checkTime }}</span>
        <van-icon name="arrow" />
      </div>
      <div class="content">
        <img src="@/assets/images/dr.png" alt="" />
        <div class="info">
          <span>
            检查医院：<b>{{ inspectionItem.hospital }}</b>
          </span>
          <span>
            检查类型：<b>{{ inspectionItem.checkType }}</b>
          </span>
          <span>
            检查部位：<b>{{ inspectionItem.checkPart }}</b>
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, onMounted, nextTick } from "vue";
import dayjs from "dayjs";
import router from "@/router";
import { defaultSectionOption } from "@/enums/numeric";
import type { RecordHistoryItem } from "@/api/server/type";
import useSystemStore from "@/stores/modules/system";
import system from "@/api/server/system";
import type { DropdownItemInstance } from "vant";
import { showToast } from "vant";

const systemStore = useSystemStore();

const nowYear = dayjs().year(); //当前年份
const nowMonth = dayjs().month(); //当前月份

const sectionOption = [...defaultSectionOption];
const sectionVal = ref<string>("1");
const isYear = ref<boolean>(false); //是否按年显示
const checkDate = ref<string>(""); //检查日期

const defaultDateContent: any = {
  columnsType: ["year", "month"],
  maxDate: new Date(nowYear, nowMonth),
  minDate: new Date(2015, 1),
  currentDate: [`${nowYear}`, `${nowMonth}`],
};
let dateContent = reactive(defaultDateContent);

const inspectionList = ref<RecordHistoryItem[]>([]);

const dropdownItemRef = ref<DropdownItemInstance>();

/**
 * @description: 确定日期选择
 * @return {*}
 */
function dateConfirm() {
  console.log(dateContent.currentDate, "currentDate");
  const params = {
    checkDate: dateContent.currentDate.join("-"),
    checkType: "",
  };
  getRecordHistory(params);
  dropdownItemRef.value?.toggle();
}

/**
 * @description: 菜单关闭触发查询
 * @return {*}
 */
function whenClose() {
  console.log("cahxun ");
}

/**
 * @description: 查看报告
 * @return {*}
 */
function lookInspection(inspectionItem: RecordHistoryItem) {
  const { userInfo } = systemStore;
  const newUserInfo = {
    ...userInfo,
    orderIdentity: inspectionItem.orderIdentity,
  };
  systemStore.$patch({
    userInfo: newUserInfo,
    selfUserInfo: newUserInfo,
  });
  nextTick(() => {
    router.push("/inspection-report");
  });
}

watch(sectionVal, () => {
  // 按科室选择
  const params = {
    checkDate: "",
    checkType: sectionVal.value,
  };
  getRecordHistory(params);
});
watch(isYear, () => {
  // 按年选择
  if (isYear.value) {
    dateContent.columnsType = ["year"];
    dateContent.currentDate = [`${nowYear}`];
  } else {
    dateContent.columnsType = ["year", "month"];
    dateContent.currentDate = [`${nowYear}`, `${nowMonth}`];
  }
});
function getRecordHistory({ checkDate = "", checkType = "" }) {
  const { userId } = systemStore.selfUserInfo;
  system
    .getRecordHistory({ userId, checkDate, checkType })
    .then(({ data: { code, data, message } }) => {
      if (code === "200") {
        inspectionList.value = data;
      } else {
        showToast(message);
      }
    })
    .catch((err) => console.log(err));
}

onMounted(() => {
  getRecordHistory({ checkDate: "", checkType: "" });
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/global.scss";
#history-record {
  @extend .main-content-views;
  padding: 40px 0 0 0;
  .drop-down-menu {
    margin-bottom: 10px;
    .date-button {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      .year {
        border-right: none;
        background-color: v-bind("isYear? '#1989fa': '#fff'");
      }
      .month {
        background-color: v-bind("!isYear? '#1989fa': '#fff'");
      }
      .van-button {
        height: 35px;
        width: 80px;
        border-radius: 0;
      }
    }
    .func-button {
      @extend .date-button;
      justify-content: space-around;
      .van-button {
        height: 40px;
        width: 160px;
        border-radius: 0;
      }
    }
  }
  .history-content {
    margin: 15px 15px 0 15px;
    background-color: #fff;
    height: 120px;
    border-radius: 12px;
    .content-title {
      color: #000;
      padding: 5px 15px 5px 15px;
      display: flex;
      justify-content: space-between;
      .van-icon {
        line-height: 20px;
      }
    }
    .content {
      padding: 0px 15px;
      display: flex;
      img {
        height: 80px;
        width: 80px;
      }
      .info {
        margin-left: 10px;
        color: #888;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        b {
          color: #000;
        }
      }
    }
  }
}
</style>
