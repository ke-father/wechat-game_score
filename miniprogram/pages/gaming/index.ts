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

interface IHandleOperationData {
    sliderMin: number
    sliderMax: number,
    sliderValue: number
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
    MemberPool: Map<number, number>,
    // 操作栏数据
    handleOperationData: IHandleOperationData
    // 是否开牌
    isOpen: boolean,
    // 下注成员
    raiseMember?: {
        score: number,
        member: IMember
    }
}

interface IRunGameCustom {
    // 监听成员激活索引变化
    listenCurrentMemberIndexChange: (newValue: number, oldValue: number) => void
    // 监听是否开牌
    listenIsOpenChange: (newValue: boolean) => void
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
    handleOperationMember: (isStart?: boolean) => void
    // 成员下注行为
    memberAction: (action: { action: POKER_BEHAVIOR_TYPE, score: number }) => void
    // 成员下注行为 —— 弃牌
    memberActionByFold: () => void
    // 成员下注行为 —— 过牌
    memberActionByCheck: () => void
    // 成员下注行为 —— 下注
    memberActionByBet: () => void
    // 成员下注行为 —— 跟注
    memberActionByCall: () => void
    // 成员下注行为 —— ALL IN
    memberActionByAllIn: () => void
    // 收池操作
    CollectScore: () => void
    // 成员行为 —— 翻前
    pre_Flop_MemberAction: () => void
    // 成员行为 —— 翻后
    Flop_MemberAction: () => void
    // 成员行为 —— 转牌
    Turn_MemberAction: () => void
    // 成员行为 —— 河牌
    River_MemberAction: () => void
    // 成员行为 —— 结束本轮
    end_memberAction: () => void
    // 获取当前下注最小值与最大值
    getMemberPoolScoreMinAndMax: () => {
        min: number,
        max: number
    }
    // 滑动器change事件
    sliderChange: (e: WechatMiniprogram.TouchEvent) => void
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
        MemberPool: new Map([]),
        handleOperationData: {
            sliderMin: 0,
            sliderMax: 0,
            sliderValue: 0
        },
        isOpen: false
    },

    onLoad() {
        console.log('onLoad')
        this.data.memberList = Array.from({length: 10}, (_, index) => {
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
            memberList: this.data.memberList,
            MemberPool: new Map()
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
            },
            // 监听开牌
            'isOpen': {
                target: this.data,
                handler: this.listenIsOpenChange
            }
        })

        console.log('onReady')
    },

    listenCurrentMemberIndexChange (newIndex: number) {
        let index = newIndex
        let status = this.data.currentMaxMemberListLength - 1 >= index
        if (!status) {
            this.data.currentMemberIndex = 0
            return
        }
        let member = this.data.memberList[index as number]
        // 判断是否弃牌
        if (member.currentAction.action === POKER_BEHAVIOR_TYPE.FOLD) {
            this.data.currentMemberIndex++
            return
        }
        let values = this.getMemberPoolScoreMinAndMax()
        this.data.handleOperationData.sliderMax = member.currentScore
        this.data.handleOperationData.sliderMin = values.max - (member.currentAction.score || 0)
        this.data.handleOperationData.sliderValue = this.data.handleOperationData.sliderMin

        this.setData({
            handleOperationData: this.data.handleOperationData
        })

        switch (this.data.playStatus) {
            case POKER_ACTION_TYPE.PRE_FLOP:
                this.pre_Flop_MemberAction()
                break
        }
    },

    listenIsOpenChange (isOpen) {
        // const isOpen = handleOperationData.isOpen
        // if (isOpen) {
        //     // 开牌进入下一阶段
        //     console.log('isOpen nextLevel')
        // }
        if (!isOpen) return

        this.handleOperationMember()
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

    memberActionByFold () {
        this.memberAction({
            action: POKER_BEHAVIOR_TYPE.FOLD,
            score: 0
        })
    },

    memberActionByCheck () {
        this.memberAction({
            action: POKER_BEHAVIOR_TYPE.CHECK,
            score: 0
        })
    },

    memberActionByBet () {
        let member = this.data.memberList[this.data.currentMemberIndex]

        // 判断下注的分数
        let memberTotalScore = member.currentScore
        // 代表allIn
        if (this.data.handleOperationData.sliderValue === memberTotalScore) {
            this.memberActionByAllIn()
            return
        }

        if (!this.data.handleOperationData.sliderValue) {
            this.memberActionByCheck()
            return
        }

        let score = this.data.handleOperationData.sliderValue + (member.currentAction.score || 0)
        let raiseScore = this.data.raiseMember ? this.data.raiseMember.score : 0
        // 表示call
        if (score === raiseScore) {
            this.memberActionByCall()
            return
        }

        this.memberAction({
            action: POKER_BEHAVIOR_TYPE.RAISE,
            score
        })
    },

    memberActionByCall () {
        let values = this.getMemberPoolScoreMinAndMax()
        let member = this.data.memberList[this.data.currentMemberIndex]
        if (member.currentPosition === POKER_POSITION_TYPE.SB) {
            let status = true
            if (values.max !== values.min) status = false
            if (!status || values.max !== member.currentAction.score) status = false
            if (status) {
                console.log(member)
                this.data.isOpen = true
                this.setData({
                    handleOperationData: this.data.handleOperationData
                })
                return
            }
        }
        let score = values.max - (member.currentAction.score || 0)
        this.memberAction({
            action: POKER_BEHAVIOR_TYPE.CALL,
            score: score
        })
    },

    memberActionByAllIn () {
        let member = this.data.memberList[this.data.currentMemberIndex]
        let totalScore = member.currentScore

        this.data.handleOperationData.sliderValue = totalScore
        this.setData({
            ['handleOperationData.sliderValue']: totalScore
        })

        this.memberAction({
            action: POKER_BEHAVIOR_TYPE.ALL_IN,
            score: totalScore
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
            this.data.MemberPool.set(this.data.currentMemberIndex, score)
        }
        // 存在则累加分数
        else {
            let betScore: number = bet.score || 0 as number
            if (action === POKER_BEHAVIOR_TYPE.FOLD) betScore = 0
            this.data.MemberPool.set(this.data.currentMemberIndex, betScore + score)
            member.placeBet.set(this.data.playStatus, {action: isAllIn ? POKER_BEHAVIOR_TYPE.ALL_IN : action, score: betScore + score})
            member.currentAction = {
                action: isAllIn ? POKER_BEHAVIOR_TYPE.ALL_IN : action,
                score: betScore + score
            }
        }

        // 记录RAISE的成员
        if (action === POKER_BEHAVIOR_TYPE.RAISE) {
            this.data.raiseMember = {
                score: member.currentAction.score as number,
                member
            }
        }

        // 更新当前操作成员
        memberIndex++
        this.data.currentMemberIndex = memberIndex > this.data.currentMaxMemberListLength - 1 ? 0 : memberIndex

        this.setData({
            IntegralPool: this.data.IntegralPool,
            currentMemberIndex: this.data.currentMemberIndex,
            memberList: this.data.memberList,
            MemberPool: this.data.MemberPool
        })
    },

    CollectScore () {
        // 查找小盲
        this.data.memberList.map((member, index) => {
            if (member.currentPosition === POKER_POSITION_TYPE.BB) this.data.currentMemberIndex = index
            member.currentAction.score = 0
            member.currentAction.action = member.currentAction.action !== POKER_BEHAVIOR_TYPE.FOLD ? POKER_BEHAVIOR_TYPE.WAIT : POKER_BEHAVIOR_TYPE.FOLD
        })

        this.setData({
            memberList: this.data.memberList
        })
    },

    pre_Flop_MemberAction() {
        let member = this.data.memberList[this.data.currentMemberIndex]
        let score = 0
        if ([POKER_POSITION_TYPE.BB, POKER_POSITION_TYPE.SB].includes(member.currentPosition as POKER_POSITION_TYPE) && member.currentAction.action === POKER_BEHAVIOR_TYPE.WAIT) {
            if (member.currentPosition === POKER_POSITION_TYPE.BB) score = 20
            if (member.currentPosition === POKER_POSITION_TYPE.SB) score = 40
            score && this.memberAction({action: POKER_BEHAVIOR_TYPE.RAISE, score: score})

            return
        }

        let raiseMember = this.data.raiseMember ? this.data.raiseMember : null

        if (member?.currentPosition === POKER_POSITION_TYPE.SB && member.currentAction.score === 40){
            this.data.isOpen = false
        } else if (raiseMember && (raiseMember as any) === member) this.data.isOpen = true

        this.setData({
            handleOperationData: this.data.handleOperationData
        })
    },

    Flop_MemberAction () {
        this.CollectScore()
    },

    Turn_MemberAction () {
        this.CollectScore()
    },

    River_MemberAction () {
        this.CollectScore()
    },

    end_memberAction () {},

    handleOperationMember(isStart = false) {
        if (isStart) {
            // 设置状态 当前操作索引
            this.data.currentMemberIndex = 0
            this.pre_Flop_MemberAction()
            return
        }


        // 设置当前行为
        switch (this.data.playStatus) {
            case POKER_ACTION_TYPE.PRE_FLOP:
                this.data.playStatus = POKER_ACTION_TYPE.FLOP
                this.Flop_MemberAction()
                break
            case POKER_ACTION_TYPE.FLOP:
                this.data.playStatus = POKER_ACTION_TYPE.TURN
                this.Turn_MemberAction()
                break
            case POKER_ACTION_TYPE.TURN:
                this.data.playStatus = POKER_ACTION_TYPE.RIVER
                this.River_MemberAction()
                break
            case POKER_ACTION_TYPE.RIVER:
                this.data.playStatus = POKER_ACTION_TYPE.PRE_FLOP
                this.end_memberAction()
                break
        }
    },

    startGame() {
        this.handleOperationMember(true)
    },

    endGame() {

    },

    openAddMemberDialog() {
    },

    getMemberPoolScoreMinAndMax () {
        if (this.data.MemberPool.size === 0) return {
            min: 0,
            max: 0
        }

        let values = this.data.MemberPool.values()
        let min = Infinity
        let max = -Infinity

        for (let i of values) {
            min = Math.min(i, min)
            max = Math.max(i, max)
        }

        return {
            min,
            max
        }
    },

    sliderChange (e) {
        const { value } = e.detail
        this.data.handleOperationData.sliderValue = value
        this.setData({
            handleOperationData: this.data.handleOperationData
        })
    }
});
