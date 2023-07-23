/*
 * @Date: 2023-02-01 22:54:07
 * @LastEditTime: 2023-02-02 14:29:02
 * @Description:
 */
export const SYSTEM = [
  {
    path: "modify-phone",
    name: "ModifyPhone",
    meta: {
      title: "修改手机号",
    },
    component: () => import("@/views/system/modify-phone/index.vue"),
  },
  {
    path: "binding-phone",
    name: "BindingPhone",
    meta: {
      title: "绑定手机号",
    },
    component: () => import("@/views/system/binding-phone/index.vue"),
  },
];
