// app.ts
import { getSessionKey} from "./api/login";
import DataManager from "./global/DataManager";

interface IAppOption {
    globalData: any
}

interface ICustomOptions {
  login: () => void
}

App<IAppOption & ICustomOptions>({
  globalData: {},
  onLaunch() {
    wx.checkSession({
      success() {
        console.log(2222)
      },
      fail: () => {
        console.log(1111)
        this.login()
      }
    })
  },

  async login () {
    try {
      await wx.login({
        async success(res) {
          // 发送请求获取对话key
          let data = await getSessionKey(res.code)

          DataManager.Instance.token = data.openid
          DataManager.Instance.sessionKey = data.session_key
        },
        fail(e) {
          console.error(e)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
})
