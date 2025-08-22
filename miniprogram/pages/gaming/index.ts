import watch from "../../utils/dataUtils/watch";
import {POKER_POSITION_TYPE} from "./types/enum";

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
    currentScore?: number
    // 补分
    addScore?: number,
    // 本轮位置
    currentPosition?: POKER_POSITION_TYPE,
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
}

interface IRunGameCustom {
    // 计算成员列表长度
    computedMemberListLength: () => number
    // 设置位置 图
    setPokerPositionMap: () => void
    // 设置位置 单位
    setPokerPosition: (mapPosition: POKER_POSITION_TYPE[]) => void
}

Page<IRunGameData, IRunGameCustom>({
    onHide(): void | Promise<void> {
        return undefined;
    },
    data: {
        memberList: Array.from({length: 10}, (_, index) =>{
            const name = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'][index]
            const initScore = 1000
            return ({
                name,
                initScore,
                currentScore: initScore
            })
        }),
        currentMaxMemberListLength: 0,
        pokerPositionMap: new Map()
    },

    onLoad () {
        this.setData({
            currentMaxMemberListLength: this.computedMemberListLength()
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

    computedMemberListLength () {
        return this.data.memberList.length
    },

    setPokerPositionMap () {
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

    setPokerPosition (mapPosition) {
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
            memberList: this.data.memberList
        })
    }
});
