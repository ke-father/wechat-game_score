import DataManager from "../../global/DataManager";
import { formatParams } from "../../utils/util";
import { getCurrentGame, IGame } from '../../api/game'

// 比赛分类
type ICategory = {
  text: string,
  categoryId: number,
  isRecent?: boolean
}

// 创建类型
type ICreateType = {
  name: string,
  gamePlayStyleId: number
}

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
  showLoginDialog: boolean,
  // 点击创建的比赛id
  gamePlayStyle: ICreateType,
  // 显示更多分类
  showCategoryDialog: boolean,
  visibleCategories: Array<ICategory>;
  showMoreBtn: boolean;
  scrollIntoView: string;
  showHomeScoreAnim: boolean;
  showAwayScoreAnim: boolean;
  homeScoreChange: number;
  awayScoreChange: number;
  team1Fouls: number;
  team2Fouls: number;
  foulAnimating: boolean;
  team1Timeouts: number;
  team2Timeouts: number;
  timeoutAnimating: boolean;
  team1Score: number;
  team2Score: number;
  animatingScore: boolean;
  currentGame?: IGame;
  loading: boolean;
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
  onCreateGameClick: (event: any) => void
  // 跳转比赛信息填写页面
  skipCreateGamePage: (params: ICreateType) => void
  // 关于登陆提示的确认
  onLoginTipsDialogConfirm: () => void
  // 关于登陆提示的取消
  onLoginTipsDialogCancel: () => void
  // 显示更多分类
  showMoreCategories: () => void
  // 关闭分类弹窗
  onCategoryDialogClose: () => void
  // 选择分类
  handleCategorySelect: (e: any) => void
  // 添加犯规动画方法
  addFoul: (isTeam1: boolean) => void
  // 添加暂停动画方法
  useTimeout: (isTeam1: boolean) => void
  // 获取当前比赛
  fetchCurrentGame: () => void
  // 判断分类标题展示更多
  onTabScroll: (e: any) => void
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
    // 是否展示弹框
    showLoginDialog: false,
    // 记创建点击的id
    gamePlayStyle: null!,
    // 显示更多分类
    showCategoryDialog: false,
    visibleCategories: [],
    showMoreBtn: false,
    scrollIntoView: '',
    showHomeScoreAnim: false,
    showAwayScoreAnim: false,
    homeScoreChange: 0,
    awayScoreChange: 0,
    team1Fouls: 0,
    team2Fouls: 0,
    foulAnimating: false,
    team1Timeouts: 3,  // 初始暂停次数
    team2Timeouts: 3,  // 初始暂停次数
    timeoutAnimating: false,
    team1Score: 0,
    team2Score: 0,
    animatingScore: false,
    currentGame: undefined,
    loading: true
  },

  onCreateGameClick (event: any) {
    this.useTimeout(true)
    const gameInfo: ICreateType = event.currentTarget.dataset.gameInfo

    // 记录点击
    this.data.gamePlayStyle = gameInfo

    // TODO 校验登录状态
    const loginStatus = DataManager.Instance.loginStatus
    // TODO 已登录跳转比赛信息填写页面
    if (loginStatus) {
      this.data.gamePlayStyle = null!
      console.log(this.data.gamePlayStyle)
      return this.skipCreateGamePage({
        gamePlayStyleId: gameInfo.gamePlayStyleId,
        name: gameInfo.name
      })
    }
    // TODO 未登录拉起弹框询问是否使用登录服务
    this.setData({
      showLoginDialog: true
    })
  },

  async skipCreateGamePage (params) {
    const formatUrl = formatParams('/pages/createGame/index', params)
    console.log('跳转比赛信息填写页面', formatUrl)
    try {
      await wx.navigateTo({
        url: formatUrl
      })
    } catch (e) {
      console.log(e)
      console.log('创建比赛失败')
    }
  },

  onLoginTipsDialogConfirm () {
    // TODO 跳转登录页面
    // 清除记录
    this.data.gamePlayStyle = null!
  },

  onLoginTipsDialogCancel () {
    console.log(this.data.gamePlayStyle)
    this.setData({
      showLoginDialog: false
    })
    // 跳转比赛信息填写页面
    this.skipCreateGamePage(this.data.gamePlayStyle)
    // 清除记录
    this.data.gamePlayStyle = null!
    console.log(this.data.gamePlayStyle)
  },

  async handleChangeCreateType(e: any) {
    // 处理两种不同的调用方式
    let index: number;
    let categoryId: number;

    if (e.detail) {
      // 来自mp-tabbar的事件
      index = e.detail.index;
      categoryId = this.data.categoryList[index].categoryId;
    } else {
      // 来自点击事件
      index = e.currentTarget.dataset.index;
      categoryId = this.data.categoryList[index].categoryId;
    }

    // 如果没有缓存的创建类型，则获取
    if (!this.data.currentCreateTypes[categoryId]) {
      this.data.currentCreateTypes[categoryId] = await this.getCreateTypeList(categoryId);
    }

    this.setData({
      currentCreateType: index,
      currentCategoryId: categoryId,
      currentCreateTypes: this.data.currentCreateTypes
    });
  },

  // 获取可创建比赛列表
  async getCreateTypeList (categoryId) {
    // this.data.currentCategoryId = categoryId
    console.log(categoryId)

    return await new Promise<ICreateTypeList>((resolve) => {
      resolve([
        { name: '1v1单挑', gamePlayStyleId: 1 },
        { name: '3v3半场', gamePlayStyleId: 2 },
        { name: '3v3全场', gamePlayStyleId: 3 },
        { name: '5v5半场', gamePlayStyleId: 4 },
        { name: '5v5全场', gamePlayStyleId: 5 },
        { name: '5v5全场', gamePlayStyleId: 5 },
        { name: '5v5全场', gamePlayStyleId: 5 },
        { name: '5v5全场', gamePlayStyleId: 5 },
        { name: '5v5全场', gamePlayStyleId: 5 },
        { name: '5v5全场', gamePlayStyleId: 5 },
        { name: '5v5全场', gamePlayStyleId: 5 },
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
        { text: '篮球', categoryId: 1, isRecent: true },
        { text: '足球', categoryId: 2 },
        { text: '排球', categoryId: 3 },
        { text: '乒乓球', categoryId: 4 },
        { text: '羽毛球', categoryId: 5 },
        { text: '网球', categoryId: 6 },
        { text: '台球', categoryId: 7 },
        { text: '保龄球', categoryId: 8 },
        { text: '高尔夫', categoryId: 9 },
        { text: '棒球', categoryId: 10 },
        { text: '橄榄球', categoryId: 11 },
        { text: '冰球', categoryId: 12 }
      ])
    })

    const currentCategoryId = categoryList[0].categoryId

    this.data.currentCreateTypes[currentCategoryId] = await this.getCreateTypeList(currentCategoryId)

    // 更新数据
    this.setData({
      categoryList,  // 确保设置完整的分类列表
      visibleCategories: categoryList.slice(0, 7),
      currentCategoryId,
      currentCreateTypes: this.data.currentCreateTypes
    })

    // 获取当前比赛数据
    await this.fetchCurrentGame()
  },

  // 获取当前比赛数据
  async fetchCurrentGame() {
    try {
      this.setData({ loading: true })
      const res = await getCurrentGame()

      if (res.code === 0 && res.data.hasGame) {
        const game = res.data.game!
        this.setData({
          currentGameStatus: true,
          currentGame: game,
          team1Score: game.teams[0].score,
          team2Score: game.teams[1].score,
          team1Fouls: game.teams[0].fouls,
          team2Fouls: game.teams[1].fouls,
          team1Timeouts: game.teams[0].timeouts,
          team2Timeouts: game.teams[1].timeouts
        })
      } else {
        this.setData({ currentGameStatus: false })
      }
    } catch (error) {
      console.error('获取当前比赛失败:', error)
      this.setData({ currentGameStatus: false })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 显示更多分类
  showMoreCategories() {
    this.setData({
      showCategoryDialog: true
    });
  },

  // 关闭分类弹窗
  onCategoryDialogClose() {
    this.setData({
      showCategoryDialog: false
    });
  },

  // 选择分类
  handleCategorySelect(e) {
    const category = e.currentTarget.dataset.category;

    // 更新分类列表顺序，保持最多7个可见分类
    const newVisibleCategories = [
        category,
        ...this.data.visibleCategories
            .filter(item => item.categoryId !== category.categoryId)
    ].slice(0, 7);

    this.setData({
        visibleCategories: newVisibleCategories,
        currentCategoryId: category.categoryId,
        currentCreateType: 0,
        showCategoryDialog: false
    });

    // 如果没有缓存的创建类型，则获取
    if (!this.data.currentCreateTypes[category.categoryId]) {
        this.getCreateTypeList(category.categoryId).then(types => {
            this.setData({
                [`currentCreateTypes.${category.categoryId}`]: types
            });
        });
    }
  },

  onTabScroll(e) {
    // 根据滚动位置判断是否显示更多按钮
    const { scrollLeft, scrollWidth, width } = e.detail;
    this.setData({
      showMoreBtn: scrollLeft + width + 50 >= scrollWidth
    });
  },

  // 添加犯规动画方法
  addFoul(isTeam1: boolean) {
    if (this.data.foulAnimating) return;  // 防止动画重叠

    const currentFouls = isTeam1 ? this.data.team1Fouls : this.data.team2Fouls;
    if (currentFouls >= 5) return;  // 最大犯规数限制

    // 设置动画状态
    this.setData({
      foulAnimating: true,
      [isTeam1 ? 'team1Fouls' : 'team2Fouls']: currentFouls + 1
    });

    // 动画结束后重置状态
    setTimeout(() => {
      this.setData({
        foulAnimating: false
      });
    }, 400);
  },

  // 添加暂停动画方法
  useTimeout(isTeam1: boolean) {
    if (this.data.timeoutAnimating) return;  // 防止动画重叠

    const currentTimeouts = isTeam1 ? this.data.team1Timeouts : this.data.team2Timeouts;
    if (currentTimeouts <= 0) return;  // 检查是否还有剩余暂停

    // 设置动画状态
    this.setData({
      timeoutAnimating: true,
      [isTeam1 ? 'team1Timeouts' : 'team2Timeouts']: currentTimeouts - 1
    });

    // 动画结束后重置状态
    setTimeout(() => {
      this.setData({
        timeoutAnimating: false
      });
    }, 400);
  }
})
