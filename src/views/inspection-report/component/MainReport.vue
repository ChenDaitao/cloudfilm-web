<!--
 * @Date: 2022-11-25 18:23:39
 * @LastEditTime: 2023-05-10 13:57:44
 * @Description: 主内容页
-->
<template>
  <div id="inspection-report">
    <!-- 若无报告内容则显示此组件  TODO: 调取数据接口 -->
    <WithoutContent v-if="isContent" />
    <div id="inspection-content" v-else>
      <header>
        <h3>
          <img
            class="hospital-logo"
            src="@/assets/images/red-cross.png"
            alt=""
          />
          <i class="hospital-name">{{ userInspectionInfo.hospital }}</i>
        </h3>
        <h4>{{ userInspectionInfo.checkType }} 诊断报告单</h4>
      </header>
      <main>
        <section class="bottom-cross-line">
          <ReportInfoItem label-text="检查号">
            {{ userInspectionInfo.checkNumber }}
          </ReportInfoItem>
          <ReportInfoItem label-text="检查时间">
            {{ userInspectionInfo.checkTime }}
          </ReportInfoItem>
          <ReportInfoItem label-text="检查类型">
            {{ userInspectionInfo.checkType }}
          </ReportInfoItem>
          <ReportInfoItem label-text="检查来源">
            {{ userInspectionInfo.checkFrom }}
          </ReportInfoItem>
          <ReportInfoItem label-text="检查部位">
            {{ userInspectionInfo.checkPart }}
          </ReportInfoItem>
        </section>
        <section class="report-body bottom-cross-line">
          <van-collapse v-model="activeName">
            <van-collapse-item
              title="检查所见"
              name="1examinationFinding"
              icon="circle"
            >
              {{ userInspectionInfo.checkView }}
            </van-collapse-item>
            <van-collapse-item
              title="诊断提示"
              name="diagnosticTips"
              icon="circle"
            >
              {{ userInspectionInfo.diagnosticTips }}
            </van-collapse-item>
          </van-collapse>
        </section>
        <section class="bottom-cross-line">
          <ReportInfoItem labelText="报告医生">
            {{ userInspectionInfo.reportDoctor }}
          </ReportInfoItem>
          <ReportInfoItem labelText="审核医生">
            {{ userInspectionInfo.auditDoctor }}
          </ReportInfoItem>
          <ReportInfoItem labelText="报告时间">
            {{ userInspectionInfo.reportTime }}
          </ReportInfoItem>
          <p class="focus-tips">{{}}</p>
        </section>
      </main>
      <footer>
        <section id="function-use">
          <div @click="toReport">
            <span>
              <img class="iconfont" src="@/assets/images/view-report.svg" />
            </span>
            <em>报告单</em>
          </div>
          <div @click="toViewer">
            <span>
              <img class="iconfont" src="@/assets/images/viewImage.svg" />
            </span>
            <em>查看影像</em>
          </div>
          <div @click="toDownload" v-if="systemStore.isQuickLogin">
            <span>
              <img class="iconfont" src="@/assets/images/download.svg" alt="" />
            </span>
            <em>下载影像</em>
          </div>
          <div @click="toShare" v-if="systemStore.isQuickLogin">
            <span>
              <img class="iconfont" src="@/assets/images/share.svg" alt="" />
            </span>
            <em>分享</em>
          </div>
        </section>
      </footer>

      <!-- 分享时 popup -->
      <van-popup
        v-model:show="isShare"
        round
        position="bottom"
        style="min-height: 60%"
      >
        <ShareSet
          :randomPwd="randomPwd"
          :shortUrl="shortUrl"
          :historyFlag="historyFlag"
          @generateQR="generateQR"
        />
      </van-popup>

      <!-- 下载影像 dialog -->
      <van-dialog
        v-model:show="showDownloadTips"
        title="温馨提示"
        confirm-button-text="复制链接"
        show-cancel-button
        @confirm="copyTextClick"
      >
        <div class="msg-tips">
          <span> 由于 DICOM 影像文件过大，建议复制以下链接至电脑端下载:</span>
          <span class="mid-tips">
            <i>下载链接：</i>
            <van-icon name="down" @click="toDownloadZip">直接下载</van-icon>
          </span>
          <span>{{ downloadURL }}</span>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import useSystemStore from "@/stores/modules/system";
import { copyText } from "@/hook/copyText";
import { randomString } from "@/hook/randomString";
import ShareSet from "../share/index.vue";
import ReportInfoItem from "@/components/reportInfoItem/index.vue";
import WithoutContent from "@/views/error/withoutContent/index.vue";
import { ref, onMounted, watch, nextTick } from "vue";
import { showToast } from "vant";
import system from "@/api/server/system";
import { useRouter } from "vue-router";
import { baseUrl, baseViewerUrl } from "@/setting";
import type { ShareContent } from "../share/type";
import type {
  InspectionType,
  GetReportParams,
  ShortUrlParams,
  ErrorInfo,
  ShareData,
} from "./type";

export type ShareShortUrl = {
  historyFlag: number;
  orderIdentity: string;
  code: string;
  expirTime: number;
  reportUrl: string;
};

const router = useRouter();
const systemStore = useSystemStore();

const props = defineProps(["inspectionList", "isSelfReport"]);
const emit = defineEmits(["isSelfReportView"]);

const isContent = ref<Boolean>(false); //是否存在报告
const activeName = ref(["1examinationFinding", "diagnosticTips"]); //控制显示检查所见及诊断下拉显示
const isShare = ref<boolean>(false); //是否分享

const showDownloadTips = ref<boolean>(false); //影像下载提示
const downloadURL = ref<string>("");

const randomStr = randomString(4, true);
const randomPwd = ref<string>(randomStr);
const historyFlag = ref<number>(0);
const expirTime = ref<number>(30);
const shortUrl = ref<string>("");
/**
 * @description: 查看报告
 * @return {*}
 */
const toReport = async () => {
  try {
    const { reportStudyuid } = userInspectionInfo.value;
    const base64UrlRes = await getInspectionReport({ reportStudyuid });

    if (base64UrlRes) {
      const reportUrl = "data:image/jpg;base64," + base64UrlRes;
      sessionStorage.setItem("reportUrl", reportUrl);
      router.push({
        name: "ViewReport",
      });
    }
  } catch (e) {
    showToast({
      type: "fail",
      message: (e as ErrorInfo).message ?? "查询失败！",
    });
  }
};

/**
 * @description: 查看影像
 * @return {*}
 */
const toViewer = () => {
  const { imageStudyuid } = userInspectionInfo.value;
  console.log(imageStudyuid, "imageStudyuid");
  if (imageStudyuid) {
    const viewerUrl = `${baseViewerUrl}?studyId=${imageStudyuid}`;
    window.open(viewerUrl);
  } else {
    showToast({
      type: "fail",
      message: "影像暂时无法查看， 请稍后再试～",
    });
  }
};

/**
 * @description: 下载影像
 * @return {*}
 */
const toDownload = async () => {
  const { imageStudyuid } = userInspectionInfo.value;
  const imageDownloadUrl = `${baseUrl}/wadoOrFap/zip/${imageStudyuid}`;

  try {
    const shortUrl = (await getDownloadUrl({
      url: imageDownloadUrl,
    })) as string;
    if (shortUrl) {
      downloadURL.value = shortUrl;
      showDownloadTips.value = true;
    }
  } catch (error) {
    showToast({
      type: "fail",
      message: "获取短链接失败！请稍后再试",
    });
  }
};

/**
 * @description: 生成压缩包
 * @return {*}
 */
const toDownloadZip = () => {
  const { imageStudyuid } = userInspectionInfo.value;
  if (imageStudyuid) {
    const url = `${system.baseUrl}/wadoOrFap/zip/${imageStudyuid}`;
    system.get(url, {}, { responseType: "arraybuffer" }).then(({ data }) => {
      // console.log(data);
      if (data.byteLength) {
        const fileName = `${imageStudyuid}.zip`;
        downloadZipFile(data, fileName);
      }
    });
  }
};

const toShare = () => {
  // shortUrl.value = "https://bit.ly/3XxWQnR";
  // getShareShortUrl({
  //   historyFlag: historyFlag.value,
  //   code: randomPwd.value,
  //   expirTime: expirTime.value,
  // });

  if (shortUrl.value) {
    isShare.value = true;
  } else {
    const shareData = {
      historyFlag: historyFlag.value,
      code: randomPwd.value,
      expirTime: expirTime.value,
    };
    handleGetShareShortUrl(shareData);
  }
};

const generateQR = async (payload: ShareContent) => {
  const { timeLimit, needPwd, hasHistory } = payload;
  historyFlag.value = Number(hasHistory);
  expirTime.value = timeLimit;

  const shareData = {
    historyFlag: historyFlag.value,
    code: needPwd ? randomPwd.value : "",
    expirTime: expirTime.value,
  };
  handleGetShareShortUrl(shareData);
};
async function handleGetShareShortUrl(shareData: ShareData) {
  try {
    const shareShortUrl = await getShareShortUrl(shareData);
    if (shareShortUrl) {
      shortUrl.value = shareShortUrl;
      nextTick(() => {
        isShare.value = true;
      });
    }
  } catch (error) {
    showToast({
      type: "fail",
      message: "获取短链接失败！请稍后再试",
    });
  }
}

function getShareShortUrl(shareData: ShareData) {
  if (!shareData) return "";
  return new Promise<string>((resolve, reject) => {
    const { selfUserInfo } = systemStore;
    const params = {
      historyFlag: shareData.historyFlag,
      code: shareData.code,
      expirTime: shareData.expirTime,
      orderIdentity: selfUserInfo.orderIdentity,
      reportUrl: `${window.location.origin}/quickLogin`, // 注意请用ip访问，不要使用localhost，生成短链接的服务会失效
    };
    system
      .getShareShortUrl(params)
      .then(({ data: { code, message, data } }) => {
        console.log("二维码回调", data);
        if (code === "200") {
          resolve(data);
        } else {
          reject({
            code,
            message,
          });
        }
      });
  });
}

/**
 *  转换流文件，下载zip
 */
function downloadZipFile(blobData: Blob, fileName: string) {
  const blob = new Blob([blobData], {
    type: "application/zip",
  });
  const dataUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(dataUrl);
}

/**
 * 获取原始报告base64接口
 * @param params:通过studyId 获取 base64 报告
 */
function getInspectionReport(params: GetReportParams) {
  if (!params.reportStudyuid) return;
  return new Promise((resolve, reject) => {
    system.getReport(params).then(({ data: { code, messgae, data } }) => {
      if (code === "200") {
        resolve(data);
      } else {
        reject({
          code,
          messgae,
        });
      }
    });
  });
}
/**
 * 复制短链接到剪切板
 */
function copyTextClick() {
  if (downloadURL.value) {
    const { copyToClipboard } = copyText(downloadURL.value);
    copyToClipboard();
  }
}

/**
 * 获取短链接接口
 */
function getDownloadUrl(params: ShortUrlParams) {
  if (!params.url) return;
  return new Promise((resolve, reject) => {
    system.getDownloadShortUrl(params).then(({ data: { code, data } }) => {
      if (code === "200") {
        resolve(data);
      } else {
        reject({
          code: "400",
          messgae: "获取短链接失败",
        });
      }
    });
  });
}

let userInspectionInfo = ref<InspectionType>({
  hospital: "",
  checkNumber: "",
  checkTime: "",
  checkType: "",
  checkFrom: "",
  checkPart: "",
  checkView: "",
  diagnosticTips: "",
  reportDoctor: "",
  auditDoctor: "",
  reportTime: "",
  reportStudyuid: "",
  imageStudyuid: "",
}); //用户检查信息
let selfReport: any = {}; //存储个人检查信息

watch(
  () => props,
  (newProps) => {
    const { isSelfReport, inspectionList } = newProps;
    if (inspectionList) {
      userInspectionInfo.value = inspectionList;
      emit("isSelfReportView", false);
      isContent.value = false;
    } else isContent.value = true;
    if (isSelfReport) {
      userInspectionInfo.value = selfReport;
      systemStore.userInfo = systemStore.selfUserInfo;
    }
  },
  {
    deep: true,
  }
);

/**
 * @description: 获取检查报告内容
 * @return {*}
 */
const getInspection = () => {
  const { selfUserInfo } = systemStore;
  const { orderIdentity } = selfUserInfo;
  system
    .getInspection({ orderIdentity })
    .then(({ data: { data, code } }: any) => {
      if (code == 200) {
        userInspectionInfo.value = data.inspection;
        selfReport = data.inspection;
        isContent.value = false;
      } else isContent.value = true; //无报告内容显示
    })
    .catch((err) => console.log(err));
};

onMounted(() => {
  // 通过userId查询数据
  nextTick(() => {
    getInspection();
  });
});
</script>

<style lang="scss" scoped>
#inspection-report {
  background-color: #fff;
  margin: 0 10px;
  border-radius: 10px;
  #inspection-content {
    padding: 20px 0 10px 0;
    header {
      text-align: center;
      h3 {
        font-size: 18px;
        img {
          width: 20px;
          height: 20px;
          margin-right: 4px;
          vertical-align: text-bottom;
        }
      }
      h4 {
        font-size: 14px;
      }
    }
    main {
      margin: 25px 0 10px 0px;
      .report-body {
        margin: 25px 0;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
      }
    }
    footer {
      border-top: 1px solid #ddd;
      padding-top: 10px;
      margin-top: 30px;
      #function-use {
        display: flex;
        justify-content: space-around;
        div {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          span {
            width: 40px;
            height: 40px;
            border: 1px solid #ccc;
            border-radius: 50%;
            line-height: 35px;
            display: inline-block;
            .iconfont {
              width: 25px;
              height: 25px;
            }
          }
        }
      }
    }
  }
}
.msg-tips {
  margin: 15px;
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;

  .mid-tips {
    .van-icon {
      color: #1286ff;
      line-height: 20px;
    }
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
}
</style>
