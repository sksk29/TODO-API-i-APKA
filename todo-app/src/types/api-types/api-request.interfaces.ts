import { AxiosRequestConfig } from "axios";

export interface IApiRequest {
  url: string;
  config?: AxiosRequestConfig;
}

export interface IApiSendRequest extends IApiRequest {
  data?: unknown;
}
