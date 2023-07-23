/*
 * @Date: 2023-01-31 16:48:26
 * @LastEditTime: 2023-01-31 16:59:52
 * @Description: 全局轻提示
 */
import { Toast, type ToastOptions } from "vant";

const defaultToastOptions = {
  message: "加载中",
  type: "loading" as const,
  duration: 0,
};
export const useToast = (
  use = true,
  param: ToastOptions = defaultToastOptions
) => {
  use ? Toast(param) : Toast.clear();
};
