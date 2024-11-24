// 路由参数
interface IRouteQuery {
    // 比赛方式id
    gamePlayStyleId: number
    // 比赛方式名称
    name: string
}

// 队员信息
interface ITeamMember {
    // 队员名称
    name?: string
    // 队员照片
    avatar?: string
    // 队员号码
    numberPlate: number
}

// 队伍信息
interface IGameTeamInfo {
    // 队伍名称
    teamName: string,
    // 队伍logo
    teamLogo?: string
    // 队员信息
    members?: ITeamMember[]
}

// 比赛信息
interface ICreateGameInfoData{
    // 比赛名称
    gameName: string
    // 比赛logo
    gameLogo?: string
    // 比赛队伍
    gameTeam?: IGameTeamInfo[]
}

// 规则
type IRules = {
    required?: boolean
}

// 比赛信息规则类型
type ICreateGameInfoRules = {
    // 名称
    name: keyof ICreateGameInfoData | keyof IGameTeamInfo | keyof ITeamMember
    // 规则
    rules?: IRules | IRules[]
    // 提示
    message?: string
    // 自定义校验
    //  @ts-ignore TODO 添加类型校验
    validator?: (rule, value, param, models) => void
}

// 页面数据类型
interface ICreateGameData extends IRouteQuery{
    // 比赛信息
    createGameInfo: ICreateGameInfoData
    // 比赛信息规则
    createGameInfoRules: ICreateGameInfoRules[]
}

// 自定义方法类型
interface ICreateGameCustom {
    // 监听页面back点击
    listenBackClick: () => void
    // 关于比赛校验成功
    handleCreateGameSuccess: (detail: { trigger: 'change' | 'validate' }) => void
    // 关于比赛校验失败
    handleCreateGameFail: (detail: { trigger: 'change' | 'validate', errors: any[] }) => void
}


// 比赛信息校验
const GameInfoRules: ICreateGameInfoRules[] = [
    {
        name: "gameName",
        rules: {
            required: true
        }
    }
]

// 比赛信息内容
const GameInfoData: ICreateGameInfoData = {
    gameName: '',
    gameTeam: [
        {
            teamName: ''
        },
        {
            teamName: ''
        }
    ]
}

Page<ICreateGameData, ICreateGameCustom>({
    data: {
        createGameInfo: GameInfoData,
        createGameInfoRules: GameInfoRules,
        gamePlayStyleId: null!,
        name: null!
    },

    handleCreateGameSuccess (detail) {
        console.log(detail)
    },

    handleCreateGameFail (detail) {
        console.log(detail)
    },

    async listenBackClick () {
        try {
            await wx.navigateBack()
        } catch (e) {
            console.log(e)
        }
    },

    onLoad: function (options) {
        // @ts-ignore
        const query: IRouteQuery = options

        this.setData(query)
    }
});
