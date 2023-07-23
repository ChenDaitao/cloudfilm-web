import type { GetReport, ShortUrl } from "@/api/server/type";

export type InspectionType = {
  hospital: string;
  checkNumber: string;
  checkTime: string;
  checkType: string;
  checkFrom: string;
  checkPart: string;
  checkView: string;
  diagnosticTips: string;
  reportDoctor: string;
  auditDoctor: string;
  reportTime: string;
  reportStudyuid: string;
  imageStudyuid: string;
};

export type GetReportParams = GetReport;
export type ShortUrlParams = ShortUrl;
export interface ErrorInfo {
  code: string;
  message: string;
}

export type ShareData = {
  historyFlag: number;
  code: string;
  expirTime: number;
};
