/*
 * @Date: 2023-01-31 17:04:49
 * @LastEditTime: 2023-04-30 16:26:12
 * @Description:
 */
import type { addMember } from "@/views/personal-center/management-member/type";
import Api from "../index";
import type {
  LoginTypeForm,
  searchId,
  GetReport,
  ShortUrl,
  PhoneModify,
  BindingPhone,
  DeleteMember,
  ShareShortUrl,
  ShareShortUrlRes,
  ShareVerifyRes,
  RecordHistoryRes,
} from "./type";

class system extends Api {
  /* 用户登录 */
  login(data: LoginTypeForm) {
    return this.post(`${this.baseUrl}/login`, data);
  }
  /**
   * 根据token 获取用户信息
   * @param data： token
   * @returns
   */
  getUserInfo(data: { token: string }) {
    return this.post(`${this.baseUrl}/getUserInfo`, data);
  }
  /**
   * 根据 token 获取系统配置信息
   */
  getNormalSetting(token: string) {
    return this.get(`${this.baseUrl}/getNormalSetting`, { token });
  }
  /**
   *  校验分享码是否正确
   * @param data: { code: string} 验证码
   */
  shareVerify(data: { code: string }) {
    return this.post<ShareVerifyRes>(`${this.baseUrl}/shareCodeVerify`, data);
  }

  /* 检查信息 */
  getInspection(data: { orderIdentity: string }) {
    return this.post(`${this.baseUrl}/inspection`, data, {
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  /* 获取成员列表 */
  getMemberList(data: searchId) {
    return this.post(`${this.baseUrl}/memberList`, data);
  }
  /* 添加成员 */
  addMember(data: addMember) {
    return this.post(`${this.baseUrl}/addMember`, data);
  }
  /* 删除成员 */
  deleteMember(data: DeleteMember) {
    return this.post(`${this.baseUrl}/deleteMember`, data);
  }
  /* 查询原始报告*/
  getReport(data: GetReport) {
    return this.get(`${this.baseUrl}/report/${data.reportStudyuid}`, data);
  }
  /* 获取下载短链接*/
  getDownloadShortUrl(data: ShortUrl) {
    return this.post(`${this.baseUrl}/getShortUrl`, data);
  }

  /* 获取检查记录 */
  getRecordHistory(data: {
    userId: string;
    checkDate: string;
    checkType: string;
  }) {
    return this.post<RecordHistoryRes>(`${this.baseUrl}/historyRecord`, data);
  }

  /* 修改手机号 */
  getPhoneModify(data: PhoneModify) {
    return this.post(`${this.baseUrl}/modifyPhone`, data);
  }
  /* 绑定新手机号 */
  getBindingPhone(data: BindingPhone) {
    return this.post(`${this.baseUrl}/bindingPhone`, data);
  }
  /**
   * 分享时，获取短链接url
   */
  getShareShortUrl(data: ShareShortUrl) {
    return this.post<ShareShortUrlRes>(
      `${this.baseUrl}/getShareShortUrl`,
      data,
      {
        headers: {
          "content-type": "text/plain",
        },
      }
    );
  }
}

export default new system();
