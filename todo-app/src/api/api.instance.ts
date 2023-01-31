import axiosFactory, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IApiRequest, IApiSendRequest } from "../types";

class ApiStatic {
  private static _instance: ApiStatic;

  private readonly _axiosConfig: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 10000,
    timeoutErrorMessage: "No response from server"
  };

  private readonly _axios = axiosFactory.create(this._axiosConfig);

  private constructor() {}

  private _prepareUrl(baseUrl: string): Readonly<string> {
    let url: string = baseUrl;
    if (baseUrl[0] !== "/") {
      url = `/${baseUrl}`;
    }
    return `${url}`;
  }

  public static getInstance(): ApiStatic {
    if (!ApiStatic._instance) {
      ApiStatic._instance = new ApiStatic();
    }
    return ApiStatic._instance;
  }

  public setAccessToken(token: string) {
    this._axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  public get<T>({ url, config }: IApiRequest): Promise<AxiosResponse<T>> {
    const requestUrl = this._prepareUrl(url);
    return this._axios.get<T>(requestUrl, config);
  }

  public post<T>({ url, data = {}, config }: IApiSendRequest): Promise<AxiosResponse<T>> {
    const requestUrl = this._prepareUrl(url);
    return this._axios.post<T>(requestUrl, data, config);
  }

  public put<T>({ url, data = {}, config }: IApiSendRequest): Promise<AxiosResponse<T>> {
    const requestUrl = this._prepareUrl(url);
    return this._axios.put<T>(requestUrl, data, config);
  }

  public patch<T>({ url, data = {}, config }: IApiSendRequest): Promise<AxiosResponse<T>> {
    const requestUrl = this._prepareUrl(url);
    return this._axios.patch<T>(requestUrl, data, config);
  }

  public delete<T>({ url, data = {}, config }: IApiSendRequest): Promise<AxiosResponse<T>> {
    const requestUrl = this._prepareUrl(url);
    return this._axios.delete<T>(requestUrl, {
      data,
      ...config
    });
  }
}

export const Api = ApiStatic.getInstance();
