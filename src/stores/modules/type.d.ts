/*
 * @Date: 2023-01-31 18:12:48
 * @LastEditTime: 2023-04-30 15:54:30
 * @Description:
 */

/* sytem */
export interface SystemState {
  token: string;
  isQuickLogin: boolean;
  isShare: boolean;
  historyFlag: number;
  verifyFlag: number;
  includList: string[];
  userInfo: UserInfo;
  selfUserInfo: UserInfo;
}

type UserInfo = {
  phone: string;
  msgCode: string;
  consultNumber: string;
  idCode: string;
  name: string;
  gender: string;
  orderIdentity: string;
  userId: string;
};
