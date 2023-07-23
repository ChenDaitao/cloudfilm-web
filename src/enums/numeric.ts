/*
 * @Date: 2023-02-02 21:35:26
 * @LastEditTime: 2023-02-26 23:59:59
 * @Description:
 */
export const defaultSectionOption = [
  { text: "全部", value: "" },
  { text: "放射", value: "1" },
  { text: "超声", value: "2" },
  { text: "内镜", value: "3" },
  { text: "病理", value: "4" },
];

export const defaultShareTimeLimit = [
  {
    name: "1小时有效",
    value: 60,
  },
  {
    name: "1天有效",
    value: 24 * 60,
  },
  {
    name: "7天有效",
    value: 7 * 24 * 60,
  },
  {
    name: "30天有效",
    value: 30 * 24 * 60,
  },
];

export const defaultRelationPopup = [
  {
    text: "父母",
    value: "parent",
  },
  {
    text: "夫妻",
    value: "couple",
  },
  {
    text: "子女",
    value: "children",
  },
  {
    text: "其他",
    value: "other",
  },
];

export const defaultGenderPopup = [
  {
    text: "保密",
    value: "secret",
  },
  {
    text: "男",
    value: "boy",
  },
  {
    text: "女",
    value: "girl",
  },
];
