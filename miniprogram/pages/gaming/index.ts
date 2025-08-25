import watch from "../../utils/dataUtils/watch";
import {POKER_ACTION_TYPE, POKER_BEHAVIOR_TYPE, POKER_POSITION_TYPE} from "./types/enum";

interface IPositionStyle {
    top?: string
    left?: string
    bottom?: string
    right?: string
    transform: string
}

interface IMember {
    // 名称
    name: string
    // 初始分数
    initScore: number
    // 当前分数
    currentScore: number
    // 补分
    addScore?: number
    // 本轮位置
    currentPosition?: POKER_POSITION_TYPE
    // 样式
    style?: IPositionStyle
}

interface IRunGameData {
    // 成员列表
    memberList: IMember[]
    // 当前最大成员列表长度
    currentMaxMemberListLength: number
    // 位置图
    pokerPositionMap: Map<number, IMember>
    // 当前行动成员索引
    currentMemberIndex: number
    // 本轮行动
    currentActionsMap?: Map<POKER_ACTION_TYPE, Map<any, any>>
    // 行动状态 —— 圈数
    playStatus: POKER_ACTION_TYPE
    // 积分池
    IntegralPool: number
}

interface IRunGameCustom {
    // 计算成员列表长度
    computedMemberListLength: () => number
    // 设置位置 图
    setPokerPositionMap: () => void
    // 设置位置 单位
    setPokerPosition: (mapPosition: POKER_POSITION_TYPE[]) => void
    // 开始本局
    startGame: () => void
    // 结束本局
    endGame: () => void
    // 增加成员
    openAddMemberDialog: () => void
    // 操作成员执行
    handleOperationMember: () => void
    // 成员下注行为
    memberAction: (action: { action: POKER_BEHAVIOR_TYPE, score: number }) => void
    // 成员行为 —— 翻前
    pre_Flop_MemberAction: () => void
}

Page<IRunGameData, IRunGameCustom>({
    onHide(): void | Promise<void> {
        return undefined;
    },
    data: {
        memberList: Array.from({length: 6}, (_, index) => {
            const name = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'][index]
            const initScore = 1000
            return ({
                name,
                initScore,
                currentScore: initScore
            })
        }),
        currentMaxMemberListLength: 0,
        pokerPositionMap: new Map(),
        currentMemberIndex: 0,
        currentActionsMap: new Map(),
        playStatus: POKER_ACTION_TYPE.PRE_FLOP,
        IntegralPool: 0
    },

    onLoad() {
        this.setData({
            currentMaxMemberListLength: this.computedMemberListLength(),
            currentActionsMap: new Map([
                [POKER_ACTION_TYPE.PRE_FLOP, new Map()],
                [POKER_ACTION_TYPE.FLOP, new Map()],
                [POKER_ACTION_TYPE.TURN, new Map()],
                [POKER_ACTION_TYPE.RIVER, new Map()],
            ])
        })
        this.setPokerPositionMap()
    },

    onShow(): void | Promise<void> {
        console.log('onShow')
    },

    // 生命周期 —— 挂载成功后
    onReady(): void | Promise<void> {
        watch(this, {
            // 'gameStatus': {
            //     target: this.data,
            //     handler: this.listenGameStatusChange
            // }
        })

        console.log('onReady')
    },

    // listenGameStatusChange (newValue: GAME_STATUS) {
    //     switch (newValue) {
    //         case GAME_STATUS.PLAYING:
    //             this.handlePlayingGame()
    //             break
    //         case GAME_STATUS.PAUSED:
    //             this.handlePauseGame()
    //             break
    //     }
    // },

    computedMemberListLength() {
        return this.data.memberList.length
    },

    setPokerPositionMap() {
        let mapPokerPosition: POKER_POSITION_TYPE[] = Array.from({length: this.data.memberList.length}, (_, index) => {
            let position: POKER_POSITION_TYPE = POKER_POSITION_TYPE.MP
            if ([2, 3, 4].includes(index)) position = POKER_POSITION_TYPE.UTG
            if (index === this.data.memberList.length - 1) position = POKER_POSITION_TYPE.BTN
            if (index === this.data.memberList.length - 2) position = POKER_POSITION_TYPE.CO
            if (index === this.data.memberList.length - 3) position = POKER_POSITION_TYPE.HJ
            if (index === 0) position = POKER_POSITION_TYPE.BB
            if (index === 1) position = POKER_POSITION_TYPE.SB

            return position
        })

        this.setPokerPosition(mapPokerPosition)
    },

    setPokerPosition(mapPosition) {
        this.data.pokerPositionMap = new Map()
        let memberLength = this.data.memberList.length
        Array.from({length: memberLength}).map((_, index) => {
            // 获取内容对象
            let findItem = this.data.memberList[index]
            if (!findItem) return
            // @ts-ignore
            findItem.currentPosition = mapPosition[index]
            this.data.pokerPositionMap.set(index, this.data.memberList[index])
        })

        this.setData({
            pokerPositionMap: this.data.pokerPositionMap,
            memberList: this.data.memberList,
            currentMemberIndex: 0
        })
    },

    memberAction ({ action, score }) {
        // 索引
        let memberIndex = this.data.currentMemberIndex
        // 成员
        let member = this.data.memberList[this.data.currentMemberIndex]
        console.log(this.data.currentActionsMap)
        // 检查行为池中是否存在行为
        let actionMap = this.data.currentActionsMap!.get(this.data.playStatus)
        // 记录步骤
        let stepIndex = actionMap!.size
        // 记录内容
        actionMap!.set(stepIndex, {
            member: member.name,
            action,
            score
        })
        // 更新分数
        member.currentScore = member.currentScore - score
        // 更新奖池
        this.data.IntegralPool += score

        // 更新当前操作成员
        memberIndex++
        this.data.currentMemberIndex = memberIndex > this.data.currentMaxMemberListLength - 1 ? 0 : memberIndex

        this.setData({
            memberList: this.data.memberList,
            IntegralPool: this.data.IntegralPool,
            currentMemberIndex: this.data.currentMemberIndex
        })

        this.pre_Flop_MemberAction()
    },

    pre_Flop_MemberAction() {
        console.log(this.data.currentMemberIndex)
        let member = this.data.memberList[this.data.currentMemberIndex]
        let score = 0

        switch (this.data.playStatus) {
            case POKER_ACTION_TYPE.PRE_FLOP:
                if (member.currentPosition === POKER_POSITION_TYPE.BB) score = 20
                if (member.currentPosition === POKER_POSITION_TYPE.SB) score = 40
                break
        }

        score && this.memberAction({ action: POKER_BEHAVIOR_TYPE.RAISE, score: score })
    },

    handleOperationMember() {
        // 设置状态 当前操作索引
        this.data.currentMemberIndex = 0
        // 设置当前行为
        this.data.playStatus = POKER_ACTION_TYPE.PRE_FLOP
        // 设置开始行动
        this.pre_Flop_MemberAction()
    },

    startGame() {
        this.handleOperationMember()
    },

    endGame() {

    },

    openAddMemberDialog() {
    }
});
