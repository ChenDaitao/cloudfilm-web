export const INSPECTION_REPORT = [
  {
    path: "homepage",
    name: "InspectionReportHomePage",
    component: () => import("@/views/inspection-report/index.vue"),
    meta: {
      title: "检查报告",
      showTabBar: true,
      keepAlive: true,
    },
  },
  {
    path: "history-record",
    name: "HistoryRecord",
    meta: {
      title: "检查记录",
    },
    component: () =>
      import("@/views/inspection-report/history-record/index.vue"),
  },
  {
    path: "share-verify",
    name: "ShareVerify",
    meta: {
      title: "分享授权",
    },
    component: () =>
      import("@/views/inspection-report/share/shareVerify/index.vue"),
  },
  {
    path: "view-report",
    name: "ViewReport",
    meta: {
      title: "查看报告",
    },
    component: () => import("@/views/inspection-report/view-report/index.vue"),
  },
  {
    path: "share-runtime",
    name: "ShareRuntime",
    meta: {
      title: "检查报告",
    },
    component: () =>
      import(
        "@/views/inspection-report/share/shareVerify/shareRuntime/index.vue"
      ),
  },
  // {
  //   path: "check-record",
  //   name: "Check-Record",
  // },
];
