<!--
 * @Date: 2022-12-02 10:14:59
 * @LastEditTime: 2023-04-30 16:21:37
 * @Description: add/edit member
-->
<template>
  <div id="add-member-info" class="main-content-views">
    <van-form>
      <van-field
        class="border-top"
        v-model="infoForm.relation"
        is-link
        readonly
        name="picker"
        label="关系"
        @click="showPopupPicker('R')"
      />
      <van-field
        v-model="infoForm.gender"
        is-link
        readonly
        name="picker"
        label="性别"
        @click="showPopupPicker('G')"
      />
      <van-field
        class="border-bottom"
        v-model="infoForm.name"
        required
        label="真实姓名"
        placeholder="请填写真实姓名(必填)"
      />
    </van-form>
    <div class="inputField-reminder">
      <em style="color: red">*</em>
      以下号码类型请至少填写一项，系统会根据您填写的信息进行检查记录的匹配
    </div>
    <van-form class="inputField">
      <van-field
        class="border-top"
        v-model="infoForm.idCode"
        label="身份证号"
        placeholder="请填写身份证号"
      />
      <van-field
        class="border-bottom"
        v-model="infoForm.consultNumber"
        label="就诊号"
        placeholder="请填写就诊号"
      />
    </van-form>
    <van-button class="save-btn" type="primary" round @click="handleSave">
      保存
    </van-button>
    <van-button class="cancel-btn" round @click="handleSave(false)">
      取消
    </van-button>

    <!-- popup 动作面板 -->
    <van-popup v-model:show="showPopup" position="bottom">
      <van-picker
        style="height: 35%"
        :columns="columnsPopupShow"
        @confirm="onConfirm"
        @cancel="showPopup = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { defaultRelationPopup, defaultGenderPopup } from "@/enums/numeric";
import type { ColumnsPopup, InfoForm, Picker, ConifrmItem } from "./type";
import router from "@/router/index";
import { ref, reactive, toRaw } from "vue";
import { useRoute } from "vue-router";
import { showSuccessToast, showToast } from "vant";
import system from "@/api/server/system";
import useSystemStore from "@/stores/modules/system";
import { randomString } from "@/hook/randomString";

const infoForm = ref<InfoForm>({
  relation: defaultRelationPopup[0].text,
  gender: defaultGenderPopup[0].text,
  name: "",
  idCode: "",
  consultNumber: "",
  ownId: "", //处理编辑,删除Id
  userId: "",
  orderIdentity: "",
});

const columns: ColumnsPopup = {
  relationColumns: defaultRelationPopup,
  genderColumns: defaultGenderPopup,
};

const showPopup = ref<boolean>(false); //控制面板显示
const pickerType = ref<string>("R"); //处理类型面板显示
let columnsPopupShow = reactive<Picker[]>(columns.relationColumns); //处理面板类型显示

const route = useRoute();

/**
 * @description: 是否编辑进入
 * @return {*}
 */
function isEdit() {
  const queryArr: string[] = Object.keys(route.query);
  if (queryArr.length != 0) {
    infoForm.value = route.query as InfoForm;
    genderSwitchCn(infoForm.value.gender);
  }
}

/**
 * @description:处理不同类型picker选中
 * @param {*} type G--性别  R--关系
 * @return {*}
 */
function showPopupPicker(type: string) {
  pickerType.value = type;
  columnsPopupShow =
    type == "G" ? columns.genderColumns : columns.relationColumns;
  showPopup.value = true;
}

/**
 * @description: 确定面板选中
 * @param {*} selectedIndexes
 * @return {*}
 */
function onConfirm({ selectedIndexes }: ConifrmItem) {
  const { relationColumns, genderColumns } = columns;
  if (pickerType.value == "G")
    infoForm.value.gender = genderColumns[selectedIndexes[0]].text;
  else infoForm.value.relation = relationColumns[selectedIndexes[0]].text;
  showPopup.value = false;
}

/**
 * @description: 处理保存
 * @param {*} isSave false--取消 true--保存
 * @return {*}
 */
function handleSave(isSave: boolean) {
  const { idCode, name, consultNumber } = infoForm.value;
  if (isSave) {
    if (name && (idCode || consultNumber)) {
      addMember();
    } else showToast("请填写完整信息！");
  } else router.push("/inspection-report");
}

/**
 * @description: 添加成员
 * @return {*}
 */
const systemStore = useSystemStore();
function addMember() {
  infoForm.value.userId = systemStore.selfUserInfo.userId;
  infoForm.value.ownId = infoForm.value.ownId
    ? infoForm.value.ownId
    : randomString(5);
  genderSwitchEn(infoForm.value.gender);
  system
    .addMember(infoForm.value)
    .then(({ data: { code, message } }) => {
      if (code == "200") {
        showSuccessToast(message);
        router.push("/inspection-report");
      } else showToast("添加失败，请稍后重试");
    })
    .catch((err) => console.log(err));
}

/**
 * @description: gender值转换 英文
 * @param {*} genderText
 * @return {*}
 */
const genderSwitchEn = (genderText: string | undefined) => {
  switch (genderText) {
    case "男":
      infoForm.value.gender = "boy";
      break;
    case "女":
      infoForm.value.gender = "girl";
      break;
    default:
      infoForm.value.gender = "secret";
      break;
  }
};
/**
 * @description: gender值转换 中文
 * @param {*} genderText
 * @return {*}
 */
const genderSwitchCn = (genderText: string | undefined) => {
  switch (genderText) {
    case "boy":
      infoForm.value.gender = "男";
      break;
    case "girl":
      infoForm.value.gender = "女";
      break;
    default:
      infoForm.value.gender = "保密";
      break;
  }
};
isEdit();
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixin/index.scss";
#add-member-info {
  margin-top: 10px;

  .inputField-reminder {
    font-size: 12px;
    margin: 25px 0 15px 0;
  }
  .save-btn {
    margin-top: 20px;
    width: 100%;
  }
  .cancel-btn {
    @extend .save-btn;
    margin-top: 8px;
  }
}
</style>
