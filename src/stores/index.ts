/*
 * @Date: 2023-01-31 17:56:33
 * @LastEditTime: 2023-02-07 21:56:41
 * @Description: 注册pinia
 */

import { createPinia } from "pinia";
import type { App } from "vue";

const store = createPinia();

export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
