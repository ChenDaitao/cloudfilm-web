/*
 * @Date: 2022-11-10 12:02:26
 * @LastEditTime: 2023-02-18 20:43:43
 * @Description: 注册vant 组件
 */
import type { App } from "vue";
import {
  Field,
  Toast,
  Icon,
  Button,
  Checkbox,
  Dialog,
  Popup,
  Collapse,
  CollapseItem,
  Picker,
  Form,
  Cell,
  ActionSheet,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  Image as VanImage,
  Lazyload,
  Skeleton,
  PasswordInput,
  NumberKeyboard,
} from "vant";

const components = [
  Field,
  Toast,
  Icon,
  Button,
  Checkbox,
  Dialog,
  Popup,
  Collapse,
  CollapseItem,
  Picker,
  Form,
  Cell,
  ActionSheet,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  VanImage,
  Lazyload,
  Skeleton,
  PasswordInput,
  NumberKeyboard,
];

export default function componentRegister(vueApp: App) {
  components.forEach((item) => void vueApp.use(item));
}
