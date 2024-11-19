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
  currentGameStatus: boolean,
  categoryList: Array<ICategory>,
  currentCategoryId: number,
  currentCreateTypes: {
    [key: number]: ICreateTypeList
  },
  currentCreateType: number
}

/**
 * detail
 * - index: 激活的创建类型的index
 * - item: 激活的创建类型
 */
type IHandleChangeCreateType = {
  detail: { index: number, item: ICategory }
}

type ICustom = {
  handleChangeCreateType: (event: IHandleChangeCreateType) => void
  getCreateTypeList: (categoryId: number) => Promise<ICreateTypeList>
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
    currentCreateType: 0
  },

  // 关于 tab栏的更改
  async handleChangeCreateType({detail: {item}}) {
    const currentCategoryId = item.categoryId

    this.data.currentCreateTypes[currentCategoryId] = await this.getCreateTypeList(item.categoryId)

    this.setData({
      currentCategoryId,
      currentCreateTypes: this.data.currentCreateTypes
    })

    console.log(this.data.currentCreateTypes)
  },

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
    console.log(DataManager.Instance.tabbar)
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

    console.log(this.data.currentCreateTypes)
  }
})
