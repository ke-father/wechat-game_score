// app.ts
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
      let res = await wx.login({
        success(res) {
          console.log(res.code )
        }
      })
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }
})
