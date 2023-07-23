/*
 * @Date: 2023-02-05 11:34:50
 * @LastEditTime: 2023-02-27 00:08:58
 * @Description:
 */
type CommonRes<T> = {
  code: string;
  message: string;
  data: T;
};
export type LoginTypeForm = {
  phone?: string;
  msgCode?: string;
  consultNumber?: string;
  idCode?: string;
  name?: string;
  orderIdentity: string;
};

export type searchId = {
  userId: string;
};

export type PhoneModify = {
  msgCodeVerify: string;
};

export interface BindingPhone
  extends Pick<LoginTypeForm, "msgCode" | "phone" | "orderIdentity"> {}

export interface DeleteMember {
  ownId: string;
  userId: string;
}
export type GetReport = {
  reportStudyuid: string;
};

export type ShortUrl = {
  url: string;
  params?: Record<string, any>;
};

export type ShareShortUrl = {
  historyFlag: number;
  orderIdentity: string;
  code: string;
  expirTime: number;
  reportUrl: string;
};

export type ShareShortUrlRes = {
  data: CommonRes<string>;
};

export type ShareVerifyRes = {
  data: CommonRes<string>;
};

export type RecordHistoryItem = {
  img: string;
  hospital: "string";
  checkType: "string";
  checkPart: "string";
  checkTime: "string";
  orderIdentity: "string";
};
export type RecordHistoryRes = {
  data: CommonRes<RecordHistoryItem[]>;
};
