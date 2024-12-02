import { mockCurrentGameResponse } from '../mock/gameData'
import { ENV } from '../config/config'

// 模拟请求延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface RequestOptions {
  url: string;
  method: 'GET' | 'POST';
  data?: any;
}

class Request {
  async request<T>(options: RequestOptions): Promise<T> {
    // 如果是开发环境且启用了mock
    if (ENV.development && ENV.mock) {
      await delay(300)  // 模拟网络延迟
      
      // 根据不同的 URL 返回不同的 mock 数据
      if (options.url.includes('/game/current')) {
        return mockCurrentGameResponse as T
      }
      
      return {} as T
    }

    // 实际的请求逻辑
    try {
      const response = await wx.request({
        ...options,
      }) as unknown as { data: T }
      return response.data
    } catch (error) {
      console.error('Request failed:', error)
      throw error
    }
  }

  get<T>(options: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>({ ...options, method: 'GET' });
  }

  post<T>(options: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>({ ...options, method: 'POST' });
  }
}

const request = new Request();
export default request;
