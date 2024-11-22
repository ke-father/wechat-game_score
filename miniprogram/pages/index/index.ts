import DataManager from "../../global/DataManager";

// 比赛分类
type ICategory = {
  text: string,
  categoryId: number
}

// 创建类型
type ICreateType = {}

// 创建类型列表
type ICreateTypeList = Array<ICreateType>

/**
 * * currentGameStatus: 当前是否有正在比赛
 * * categoryList: 比赛分类列表
 * * currentCategoryId: 当前选中的比赛分类
 * * currentCreateTypes: 当前可用的创建类型
 * * currentCreateType: 当前激活的创建类型
 *
 */
type IData = {
  // 当前收否存在已关注比赛或正在进行的比赛内容
  currentGameStatus: boolean,
  // 可创建比赛分类
  categoryList: Array<ICategory>,
  // 当前选中的比赛分类
  currentCategoryId: number,
  // 可创建比赛分类下的可创建比赛内容
  currentCreateTypes: {
    [key: number]: ICreateTypeList
  },
  // 选择创建的比赛内容
  currentCreateType: number,
  // 创建比赛提示登录控制弹框
  showLoginDialog: boolean
}

/**
 * detail
 * - index: 激活的创建类型的index
 * - item: 激活的创建类型
 */
type IHandleChangeCreateType = {
  detail: { index: number, item: ICategory }
}

// 自定义方法
type ICustom = {
  // 关于 创建比赛tab栏的更改
  handleChangeCreateType: (event: IHandleChangeCreateType) => void
  // 获取可创建比赛列表
  getCreateTypeList: (categoryId: number) => Promise<ICreateTypeList>
  // 点击创建比赛
  onCreateGameClick: (createGameInfo: number) => void
  // 跳转比赛信息填写页面
  skipCreateGamePage: () => void
}

Page<IData, ICustom>({
  data: {
    // 当前是否有正在比赛内容
    currentGameStatus: true,
    // 比赛分类列表
    categoryList: [],
    // 当前选中的比赛分类
    currentCategoryId: null!,
    // 当前可用创建类型
    currentCreateTypes: {},
    // 当前激活的创建类型
    currentCreateType: 0,
    showLoginDialog: false
  },

  onCreateGameClick (createGameInfo: ICreateType) {
    console.log(createGameInfo)
    // TODO 校验登录状态
    const loginStatus = DataManager.Instance.loginStatus
    // TODO 已登录跳转比赛信息填写页面
    if (loginStatus) return this.skipCreateGamePage()
    // TODO 未登录拉起弹框询问是否使用登录服务
    this.setData({
      showLoginDialog: true
    })
  },

  skipCreateGamePage () {
    console.log('跳转比赛信息填写页面')
  },


  async handleChangeCreateType({detail: {item}}) {
    const currentCategoryId = item.categoryId

    this.data.currentCreateTypes[currentCategoryId] = await this.getCreateTypeList(item.categoryId)

    this.setData({
      currentCategoryId,
      currentCreateTypes: this.data.currentCreateTypes
    })
  },

  // 获取可创建比赛列表
  async getCreateTypeList (categoryId) {
    // this.data.currentCategoryId = categoryId
    console.log(categoryId)

    return await new Promise<ICreateTypeList>((resolve) => {
      resolve([
        { name: '1v1单挑', gameId: 1 },
        { name: '3v3半场', gameId: 2 },
        { name: '3v3全场', gameId: 3 },
        { name: '5v5半场', gameId: 4 },
        { name: '5v5全场', gameId: 5 },
        { name: '5v5全场', gameId: 5 },
        { name: '5v5全场', gameId: 5 },
        { name: '5v5全场', gameId: 5 },
        { name: '5v5全场', gameId: 5 },
        { name: '5v5全场', gameId: 5 },
        { name: '5v5全场', gameId: 5 },
      ])
    })
  },

  async onLoad(){
    // 更改footerBar状态
    this.getTabBar().setData({
      selected: DataManager.Instance.tabbar,
    })

    // 获取分类列表
    const categoryList = await new Promise<Array<ICategory>>((resolve) => {
      resolve([
        { text: '篮球', categoryId: 1 },
        { text: '足球', categoryId: 2 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
        { text: '德州', categoryId: 3 },
      ])
    })

    const currentCategoryId = categoryList[0].categoryId

    this.data.currentCreateTypes[currentCategoryId] = await this.getCreateTypeList(currentCategoryId)

    this.setData({
      categoryList,
      currentCategoryId,
      currentCreateTypes: this.data.currentCreateTypes
    })
  }
})
