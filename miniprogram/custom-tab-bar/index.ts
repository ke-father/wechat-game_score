Component({
  data: {
    selected: 0,
    footerList: [
      {
        pagePath: "/pages/index",
        iconName: "home",
        text: "比赛"
      },
      {
        pagePath: "/pages/index",
        iconName: "record",
        text: "记录"
      },
      {
        pagePath: "/pages/index",
        iconName: "me",
        text: "我的"
      }
    ]
  },

  methods: {
    async tabItemTap (e: { target: { dataset: { pagePath: string, index: number } } }) {
      console.log(e)
      const data = e.target.dataset
      const url = data.pagePath

      await wx.switchTab({ url })

      this.setData({
        selected: data.index
      })
    }
  },

  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared'
  }
})
