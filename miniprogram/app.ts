// app.ts
import { getSessionKey} from "./api/login";
import DataManager from "./global/DataManager";

interface ICustomOptions {
  login: () => void
}

App<IAppOption & ICustomOptions>({
  globalData: {},
  onLaunch() {
    this.login()
  },

  async login () {
    try {
      if (DataManager.Instance.openId && DataManager.Instance.sessionKey) return
      await wx.login({
        async success(res) {
          // 发送请求获取对话key
          let { status, message, data } = await getSessionKey(res.code)
          if (!status) throw message

          DataManager.Instance.openId = data.openid
          DataManager.Instance.sessionKey = data.session_key
        },
        fail(e) {
          console.log(e)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
})
