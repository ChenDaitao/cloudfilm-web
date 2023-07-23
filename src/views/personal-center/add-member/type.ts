/*
 * @Date: 2023-02-03 14:03:54
 * @LastEditTime: 2023-02-25 17:16:49
 * @Description:
 */
// type类型关系 interface数据结构

export type Picker = {
  text: string;
  value: string;
};
export interface ColumnsPopup {
  relationColumns: Picker[];
  genderColumns: Picker[];
}

export type InfoForm = {
  relation?: string;
  gender?: string;
  name?: string;
  idCode: string;
  consultNumber?: string;
  orderIdentity: string;
  ownId: string;
  userId: string;
};

// export interface ConifrmItem {
//   selectedIndexes: [1];
//   selectedOptions: [{ text: "夫妻"; value: "couple" }];
//   selectedValues: ["couple"];
// }
export interface ConifrmItem {
  selectedIndexes: number[];
  selectedOptions: Picker[];
  selectedValues: string[];
}
