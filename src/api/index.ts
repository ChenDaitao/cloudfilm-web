/*
 * @Date: 2023-01-30 15:24:35
 * @LastEditTime: 2023-06-11 15:21:14
 * @Description:
 */
import axios from "./interceptors";
import type { AxiosRequestConfig } from "axios";
import { randomString } from "@/hook/randomString";

// 请求基础路径
const baseUrl = "/api";
// 返回类型限制
type Result<T> = {
  code: number;
  message: string;
  result: T;
};

class Api {
  baseUrl: string;
  constructor() {
    this.baseUrl = baseUrl;
  }
  get<T = any>(
    url: string,
    param?: RequestParams,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const _ts: string = randomString(8);
    const params = Object.assign({}, param, { _ts });
    const configs = Object.assign({}, config as object, { params });
    return axios.get(url, configs);
  }

  post<T = any>(
    url: string,
    params?: RequestParams | string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return axios.post(
      url,
      params,
      config
        ? {
            ...config,
          }
        : {
            headers: {
              "content-type": "text/plain",
            },
          }
    );
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axios.delete(url, config);
  }

  put<T = any>(
    url: string,
    params?: RequestParams,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return axios.put(url, params, config);
  }
}

export default Api;
