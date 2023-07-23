/**
 * 生成随机字符串
 *  @param range - 长度
 * @param pureNumber - 是否返回纯数字组成的字符
 *
 */
export function randomString(range: number, pureNumber?: boolean): string {
  let str = "";
  const arrStr = pureNumber
    ? "0123456789"
    : "abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789";
  const wordList = arrStr.split("");

  for (let i = 0; i < range; i++) {
    const index = Math.round(Math.random() * wordList.length - 1);
    str += arrStr[index];
  }
  return str;
}
