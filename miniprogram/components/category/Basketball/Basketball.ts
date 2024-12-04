Component({
    properties: {

    },

    data: {
        // 主场队伍
        homeTeam: {
            name: '主场队伍',
            score: 99,
        },
        // 客场队伍
        awayTeam: {
            name: '客场队伍',
            score: 99,
        },
        // 比赛节数
        quarter: 'first',
        // 比赛时间
        time: '9:28',
        triggerTime: 5,
        currentTriggerTime: 3
    },

    methods: {
        fetchGameData () {},

        handleScorePlus () {
            // const getScoreAnimation = this.selectComponent('#home-score-ani')
            // console.log(getScoreAnimation)
            // getScoreAnimation.onScoreChange(3)

            this.data.currentTriggerTime++
            this.setData({
                currentTriggerTime: this.data.currentTriggerTime
            })
        }
    },

    lifetimes: {
        created() {
        }
    }
});
