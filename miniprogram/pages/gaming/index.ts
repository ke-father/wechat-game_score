import watch from "../../utils/dataUtils/watch";

interface IMember {
    // 名称
    name: string
    // 初始分数
    initScore: number
    // 当前分数
    currentScore?: number
    // 补分
    addScore?: number
}

interface IRunGameData {
    // 成员列表
    memberList: IMember[]
    // 当前最大成员列表长度
    currentMaxMemberListLength: number
}

interface IRunGameCustom {
    // 计算成员列表长度
    computedMemberListLength: () => number
}

Page<IRunGameData, IRunGameCustom>({
    onHide(): void | Promise<void> {
        return undefined;
    },
    data: {
        memberList: Array.from({length: 4}, (_, index) =>{
            const name = ['A', 'B', 'C', 'D', 'E'][index]
            const initScore = 1000
            return ({
                name,
                initScore
            })
        }),
        currentMaxMemberListLength: 0
    },

    // 生命周期 —— 挂载成功后
    onReady(): void | Promise<void> {
        watch(this, {
            // 'gameStatus': {
            //     target: this.data,
            //     handler: this.listenGameStatusChange
            // }
        })

        this.setData({
            currentMaxMemberListLength: this.computedMemberListLength()
        })
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
        let num = 0
        let maxList = [4, 8, 10]
        maxList.map((_, index) => {
            if (num) return

            let currentMax = maxList[index]
            let status = this.data.memberList.length <= currentMax
            if (status) num = currentMax
        })

        return num
    }
});
