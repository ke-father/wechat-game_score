import DataManager from "../../global/DataManager";

Component({
  data: {
    buttons: [{text: '取消'}, {text: '确认'}]
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
