import { API_BASE_URL } from '../config/config'
import DataManager from "../global/DataManager";

interface RequestOptions {
  url: string;
  method: 'GET' | 'POST';
  data?: any;
}

class Request {
  async request<T = any>(options: RequestOptions): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      wx.request({
        ...options,
        url: `${API_BASE_URL}${options.url}`,
        header: {
          token: DataManager.Instance.token
        },
        success: (response: any ) => {
          const { data } = response.data
          resolve(data)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  get<T>(options: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>({ ...options, method: 'GET' });
  }

  post<T>(options: Omit<RequestOptions, 'method'>): Promise<T> {
    // const { status, message, data } = await this.request<T>({ ...options, method: 'POST' });

    return this.request<T>({ ...options, method: 'POST' });
  }
}

const request = new Request();
export default request;
