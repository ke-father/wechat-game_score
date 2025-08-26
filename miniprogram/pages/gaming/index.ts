import watch from "../../utils/dataUtils/watch";
import {POKER_ACTION_TYPE, POKER_BEHAVIOR_TYPE, POKER_POSITION_TYPE} from "./types/enum";

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
    currentPosition?: POKER_POSITION_TYPE,
    // 当前下注
    placeBet: Map<POKER_ACTION_TYPE, {
        action: POKER_BEHAVIOR_TYPE,
        score: number | null
    }>,
    // 本轮行为
    currentAction: {
        action: POKER_BEHAVIOR_TYPE,
        score: number | null
    }
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
    // 成员池
    MemberPool: IMember[],
    // 操作栏数据
    handleOperationData: {
        sliderMin: number
        sliderMax: number,
        sliderValue: number
    }
}

interface IRunGameCustom {
    // 监听成员激活索引变化
    listenCurrentMemberIndexChange: (newValue: number, oldValue: number) => void
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
        memberList: [],
        currentMaxMemberListLength: 0,
        pokerPositionMap: new Map(),
        currentMemberIndex: 0,
        currentActionsMap: new Map([]),
        playStatus: POKER_ACTION_TYPE.PRE_FLOP,
        IntegralPool: 0,
        MemberPool: [],
        handleOperationData: {
            sliderMin: 0,
            sliderMax: 0,
            sliderValue: 0
        }
    },

    onLoad() {
        this.data.memberList = Array.from({length: 6}, (_, index) => {
            const name = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'][index]
            const initScore = 1000
            return ({
                name,
                initScore,
                currentScore: initScore,
                placeBet: new Map([
                    [POKER_ACTION_TYPE.PRE_FLOP, {
                        action: POKER_BEHAVIOR_TYPE.WAIT,
                        score: null
                    }],
                    [POKER_ACTION_TYPE.FLOP, {
                        action: POKER_BEHAVIOR_TYPE.WAIT,
                        score: null
                    }],
                    [POKER_ACTION_TYPE.TURN, {
                        action: POKER_BEHAVIOR_TYPE.WAIT,
                        score: null
                    }],
                    [POKER_ACTION_TYPE.RIVER, {
                        action: POKER_BEHAVIOR_TYPE.WAIT,
                        score: null
                    }],
                ]),
                currentAction: {
                    action: POKER_BEHAVIOR_TYPE.WAIT,
                    score: 0
                }
            })
        })
        this.setData({
            currentMaxMemberListLength: this.computedMemberListLength(),
            currentActionsMap: new Map([
                [POKER_ACTION_TYPE.PRE_FLOP, new Map()],
                [POKER_ACTION_TYPE.FLOP, new Map()],
                [POKER_ACTION_TYPE.TURN, new Map()],
                [POKER_ACTION_TYPE.RIVER, new Map()],
            ]),
            memberList: this.data.memberList
        })
        this.setPokerPositionMap()
    },

    onShow(): void | Promise<void> {
        console.log('onShow')
    },

    // 生命周期 —— 挂载成功后
    onReady(): void | Promise<void> {
        watch(this, {
            // 监听成员激活索引变化
            'currentMemberIndex': {
                target: this.data,
                handler: this.listenCurrentMemberIndexChange
            }
        })

        console.log('onReady')
    },

    listenCurrentMemberIndexChange (newIndex: Number) {
        let status = this.data.currentMaxMemberListLength - 1 >= newIndex
        if (!status) this.data.currentMemberIndex = 0
        let member = this.data.memberList[newIndex as number]
        // 判断是否弃牌
        if (member.currentAction.action === POKER_BEHAVIOR_TYPE.FOLD) this.data.currentMemberIndex++
        else {
            let isBetStatus = false
            if (this.data.playStatus !== POKER_ACTION_TYPE.PRE_FLOP || member.currentAction.score) isBetStatus = true
            if (!isBetStatus) {
                this.pre_Flop_MemberAction()
            } else {
                this.setData({
                    currentMemberIndex: newIndex as number
                })
            }
        }
    },

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

    memberAction({action, score}) {
        // 索引
        let memberIndex = this.data.currentMemberIndex
        // 成员
        let member = this.data.memberList[this.data.currentMemberIndex]
        // 检查行为池中是否存在行为
        let actionMap = this.data.currentActionsMap!.get(this.data.playStatus)

        // 更新分数
        let isAllIn = member.currentScore === score
        // 更新分数
        member.currentScore = member.currentScore - score
        // 更新奖池
        this.data.IntegralPool += score

        // 记录步骤
        let stepIndex = actionMap!.size
        // 记录内容
        actionMap!.set(stepIndex, {
            member: member.name,
            action: isAllIn ? POKER_BEHAVIOR_TYPE.ALL_IN : action,
            score
        })

        // 记录 下注
        let bet = member.placeBet.get(this.data.playStatus)
        // 不存在则初始化
        if (!bet) {
            member.placeBet.set(this.data.playStatus, {action: isAllIn ? POKER_BEHAVIOR_TYPE.ALL_IN : action, score})
            member.currentAction = {
                action: isAllIn ? POKER_BEHAVIOR_TYPE.ALL_IN : action,
                score: score
            }
        }
        // 存在则累加分数
        else {
            let betScore: number = bet.score as number
            member.placeBet.set(this.data.playStatus, {action: isAllIn ? POKER_BEHAVIOR_TYPE.ALL_IN : action, score: betScore + score})
            member.currentAction = {
                action: isAllIn ? POKER_BEHAVIOR_TYPE.ALL_IN : action,
                score: betScore + score
            }
        }

        console.log(this.data.memberList)

        // 更新当前操作成员
        memberIndex++
        this.data.currentMemberIndex = memberIndex > this.data.currentMaxMemberListLength - 1 ? 0 : memberIndex

        this.setData({
            IntegralPool: this.data.IntegralPool,
            currentMemberIndex: this.data.currentMemberIndex,
            memberList: this.data.memberList,
        })
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

        score && this.memberAction({action: POKER_BEHAVIOR_TYPE.RAISE, score: score})
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
