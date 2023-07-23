<!--
 * @Date: 2022-11-25 18:21:53
 * @LastEditTime: 2023-05-10 15:08:58
 * @Description: 用户分享
-->
<template>
  <section id="share-report">
    <div class="share-title">分享</div>
    <div class="share-tips">
      温馨提示：报告和影像包含隐私信息，分享前请确认对方是可信人士
    </div>

    <section class="share-content">
      <van-cell
        is-link
        :title="shareContent.timeLimitName"
        @click="showTimePopup = true"
      />
      <div class="need-pwd">
        <van-checkbox v-model="shareContent.needPwd" shape="square">
          密码保护
        </van-checkbox>
        <span v-if="shareContent.needPwd">{{ randomPwd }}</span>
      </div>
      <van-checkbox v-model="shareContent.hasHistory" shape="square">
        允许对方查看历史检查记录
      </van-checkbox>
    </section>
    <!-- <div class="share-button">
      <van-button class="ORcode-button" @click="buttonUse = true">
        二维码分享
      </van-button>
      <van-button class="pc-button" @click="buttonUse = false">
        电脑链接分享
      </van-button>
    </div> -->

    <section class="share-way">
      <!-- <div class="pc-way" v-if="!buttonUse">
        <span>网址： {{ pcUrl }}</span>
        <span v-if="shareContent.needPwd">授权码 {{ randomPwd }}</span>
      </div> -->
      <div class="QRcode-way" v-if="buttonUse">
        <img :src="QRcode" alt="" />
      </div>
    </section>

    <!-- <section class="func-button" v-if="!buttonUse">
      <van-button @click="copyTextClick">复制链接</van-button>
    </section> -->

    <!-- action 动作面板 -->
    <van-action-sheet
      v-model:show="showTimePopup"
      :actions="defaultShareTimeLimit"
      cancel-text="取消"
      close-on-click-action
      @select="onTimeConfirm"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import type { ShareContent, AcionResult } from "./type";
import { defaultShareTimeLimit } from "@/enums/numeric";
import QRcodeImge from "@/assets/images/QRcode.png";
// import { copyText } from "@/hook/copyText";
import QRCode from "qrcode";

const emit = defineEmits<{
  (e: "generateQR", payload: ShareContent): void;
}>();
interface Props {
  randomPwd: string;
  shortUrl: string;
  historyFlag?: number;
}
const props = withDefaults(defineProps<Props>(), {
  randomPwd: "",
  shortUrl: "",
  historyFlag: 0,
});

const QRcode = ref<string>(QRcodeImge);

const buttonUse = ref<boolean>(true); //button切换
const showTimePopup = ref<boolean>(false); //时间选择显示

const defaultShare = {
  shareType: "2", //1 pc分享 2二维码分享
  timeLimitName: defaultShareTimeLimit[0].name,
  timeLimit: 30,
  needPwd: true,
  pwd: "",
  hasHistory: false,
};
const shareContent = reactive<ShareContent>(defaultShare); //分享信息

// const pcUrl = ref<string>("https://vant-contrib.gitee.io/vant/");

// const { copyTextClick } = copyText(pcUrl.value);

/**
 * @description: 确认时间选中
 * @param {*} selectedIndexes
 * @return {*}
 */
function onTimeConfirm(actionItem: AcionResult) {
  shareContent.timeLimitName = actionItem.name;
  shareContent.timeLimit = actionItem.value;

  showTimePopup.value = false;
}

/**
 * @description: 二维码生成
 * @param {*} url
 * @return {*}
 */
async function getQRcode(url: string) {
  if (!url) return "";
  const generateQR = async (text: string) => {
    try {
      return await QRCode.toDataURL(text, {
        width: 128,
        margin: 2,
      });
    } catch (err) {
      return "";
    }
  };
  const QRcodeVal = await generateQR(url);
  if (QRcodeVal) QRcode.value = QRcodeVal;
}

const randomPwd = computed(() => props.randomPwd);

watch(shareContent, () => {
  emit("generateQR", shareContent);
});

// 监听props变化 重新生成二维码
watch(
  () => props,
  (newProps) => {
    if (newProps.shortUrl) {
      console.log(newProps.shortUrl);
      getQRcode(newProps.shortUrl);
    }
    shareContent.hasHistory = Boolean(newProps.historyFlag);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss" scoped>
#share-report {
  padding: 20px 20px 10px 20px;
  background-color: #f4f6fa;
  height: 100%;
  .share-title {
    width: 100%;
    text-align: center;
    font-weight: 600;
  }
  .share-tips {
    padding: 20px 0;
    font-size: 13px;
    color: #1286ff;
  }
  .share-content {
    width: 100%;
    .van-checkbox {
      width: 100%;
      padding: 1px 12px;
      height: 46px;
      background-color: #fff;
    }
    .need-pwd {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .van-checkbox {
        width: 100%;
      }
      span {
        background-color: #fff;
        padding-right: 20px;
        text-align: right;
        line-height: 46px;
        color: #1286ff;
      }
    }
  }
  .share-way {
    margin-top: 10px;
    padding: 30px;

    .pc-way {
      display: flex;
      flex-direction: column;
      margin-left: 3px;
      & :first-child {
        margin-bottom: 6px;
      }
    }
    .QRcode-way {
      text-align: center;
      img {
        height: 168px;
        width: 168px;
      }
    }
  }
  .share-button {
    width: 100%;
    margin-top: 15px;
    .pc-button {
      width: 50%;
      background-color: v-bind('!buttonUse ? "#1989fa": "#fff"');
      border-left: none;
    }
    .ORcode-button {
      width: 50%;
      background-color: v-bind('buttonUse ? "#1989fa": "#fff"');
      border-right: none;
    }
  }

  .func-button {
    margin-top: 15px;
    .van-button {
      width: 100%;
      color: #1286ff;
    }
  }
}
</style>
