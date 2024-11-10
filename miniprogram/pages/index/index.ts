import DataManager from "../../global/DataManager";

Component({
  data: {
    // 当前是否有正在比赛内容
    currentGameStatus: true
  },

  pageLifetimes: {
    show() {
      console.log(DataManager.Instance.tabbar)
      this.getTabBar().setData({
        selected: DataManager.Instance.tabbar
      })
    }
  }
})
