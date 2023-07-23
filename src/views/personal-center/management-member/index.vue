<!--
 * @Date: 2022-12-02 14:20:13
 * @LastEditTime: 2023-02-25 17:33:58
 * @Description: management-member
-->
<template>
  <div id="management-member" class="main-content-views">
    <div class="set-tips">{{ systemStore.secretPhone }} 登记检查的患者</div>
    <section class="exist-member">
      <div class="member-item">
        <span>{{ systemStore.userInfo.name }}</span>
      </div>
    </section>
    <div class="add-tips">手动添加成员</div>
    <section class="add-member">
      <div
        class="member-item"
        v-for="(infoItem, index) in addMemberList"
        :key="index"
      >
        <span>
          <i class="use-text">
            <em>{{ infoItem.relation }}</em> — {{ infoItem.name }}
          </i>
          <i class="use-icon">
            <van-icon
              name="edit"
              class="icon-edit"
              @click="setEdit(infoItem)"
            />
            <van-icon
              name="delete-o"
              class="icon-delete"
              @click="setDelete(infoItem)"
            />
          </i>
        </span>
      </div>
    </section>
    <van-button type="primary" round @click="addMemberBtn">添加成员</van-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { addMember } from "./type";
import useSystemStore from "@/stores/modules/system";
import { confirmUseTips } from "@/hook/tipsDialog";
import router from "@/router";
import system from "@/api/server/system";
import { showToast } from "vant";

const systemStore = useSystemStore();
const { userId } = systemStore.selfUserInfo;

const addMemberList = ref<addMember[]>([]);

/**
 * @description: 处理编辑
 * @param {*} infoItem
 * @return {*}
 */
function setEdit(infoItem: addMember) {
  router.push({
    name: "AddMember",
    query: infoItem,
  });
}

/**
 * @description: 处理删除
 * @param {*} infoItem
 * @return {*}
 */
function setDelete(infoItem: addMember) {
  const param = { message: "确认删除该成员？" };
  confirmUseTips(param, () => {
    const { ownId } = infoItem;
    system
      .deleteMember({ userId, ownId })
      .then(({ data: { code, message } }) => {
        if (code == "200") {
          addMemberList.value = addMemberList.value.filter(
            (item) => item.ownId != ownId
          );
          showToast(message);
        }
      })
      .catch((err) => console.log(err));
    console.log("delete");
  });
}

/**
 * @description: 添加成员
 * @return {*}
 */
function addMemberBtn() {
  router.push("/personal-center/add-member");
}
onMounted(() => {
  system.getMemberList({ userId }).then(({ data: { data, code } }) => {
    if (code == "200") {
      addMemberList.value = data.memberList;
    }
  });
});
</script>

<style lang="scss" scoped>
#management-member {
  position: relative;
  // font-weight: 600;
  .set-tips {
    font-size: 12px;
    margin: 8px 0;
    // font-weight: 500;
  }
  .add-tips {
    @extend .set-tips;
    margin-top: 20px;
  }
  .exist-member {
    background-color: #fff;
    border-radius: 12px;
    .member-item {
      height: 45px;
      line-height: 45px;
      text-indent: 1rem;
      font-size: 13px;
      width: 100%;
      border-bottom: 1px solid rgba(238, 238, 238, 0.3);
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .add-member {
    @extend .exist-member;
    margin-top: 10px;
    overflow-y: auto;
    max-height: 80%;
    .member-item {
      span {
        display: flex;
        justify-content: space-between;
        .use-icon {
          font-size: 18px;
          .icon-edit {
            // width: 30px;
            color: #72a9f5;
          }
          .icon-delete {
            @extend .icon-edit;
            color: #eb0c10;
            margin-right: 20px;
          }
        }
      }
    }
  }
  .van-button {
    width: 90%;
    position: absolute;
    bottom: 10px;
  }
}
</style>
