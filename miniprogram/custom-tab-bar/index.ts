import DataManager from "../global/DataManager";

Component({
  data: {
    selected: 0,
    footerList: [
      {
        pagePath: "/pages/index/index",
        iconName: "home",
        text: "比赛"
      },
      {
        pagePath: "/pages/record/index",
        iconName: "record",
        text: "记录"
      },
      {
        pagePath: "/pages/me/index",
        iconName: "me",
        text: "我的"
      }
    ]
  },

  methods: {
    getDataManager () {
      console.log(DataManager.Instance.tabbar)
      return DataManager.Instance.tabbar
    },

    async tabItemTap (e: { currentTarget: { dataset: { path: string, index: number } } }) {
      // 获取绑定的数据
      const data = e.currentTarget.dataset
      const { path: url, index: newIndex } = data
      const oldIndex = this.data.selected

     try {
       DataManager.Instance.tabbar = newIndex
       // 切换
       await wx.switchTab({
         url,
       })
     } catch (e) {
       DataManager.Instance.tabbar = oldIndex
     }
    }
  },

  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared'
  }
})
