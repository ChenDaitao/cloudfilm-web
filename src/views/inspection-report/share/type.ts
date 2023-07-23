/*
 * @Date: 2023-02-02 09:23:53
 * @LastEditTime: 2023-02-16 12:16:41
 * @Description:
 */
export interface ShareContent {
  shareType: string; //1 pc分享 2二维码分享
  timeLimit: number;
  timeLimitName: string;
  needPwd: boolean;
  pwd?: string;
  hasHistory: boolean;
}
/*
 * @Date: 2023-02-04 09:39:39
 * @LastEditTime: 2023-02-16 12:16:13
 * @Description:
 */
// action面板返回值item类型
export type AcionResult = {
  name: string;
  value: number;
};
