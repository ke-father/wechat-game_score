import request from "../utils/request";

type IGetSessionResponse = { openid: string, session_key: string }

export const getSessionKey = <T = IGetSessionResponse> (code: string) => {
    const url = '/wechat/login'

   return request.post<T>(url, {code})
}
