/*
 * @Date: 2023-01-31 11:19:01
 * @LastEditTime: 2023-02-12 18:45:23
 * @Description: 封装axios
 */

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useToast } from "@/hook/useGlobalToast";
// import systemStore from "@/stores/modules/system";
import axios from "axios";

// const useSystemStore = systemStore();

// 创建axios实例对象
const instance: AxiosInstance = axios.create({
  timeout: 100000, //设置超时时间
});

/* 请求拦截 */
instance.interceptors.request.use(
  (config /* : AxiosRequestConfig */) => {
    const token= sessionStorage.getItem('token')
    const headers = config?.headers || {};
    if (token) headers["token"] = token;
    config.headers = headers;

    return config;
  },
  (err: AxiosError) => {
    return Promise.reject(err);
  }
);

// 响应拦截
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // resHeaderSetter(response);
    const { code /*message */ } = response.data;
    switch (code) {
      case "401":
        // resetToken(); //重置token
        break;
      case "400":
        break;
      default:
        break;
    }
    return response;
  },
  (err: AxiosError) => {
    handleResponseTimeout(err);
    return Promise.reject(err.response?.data || err);
  }
);

/* 响应超时错误处理 */
function handleResponseTimeout(responseError: AxiosError): void {
  const { code, message } = responseError;
  const isTimeout = message.includes("timeout of") || code === "ECONNABORTED";
  if (isTimeout) {
    useToast(true, {
      type: "fail",
      duration: 2500,
      message: "请求超时",
    });
  }
}
export default instance;
