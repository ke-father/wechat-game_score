Component({
    properties: {

    },

    data: {
        // 主场队伍
        homeTeam: {
            name: '主场队伍',
            score: 99,
            foulTriggerTime: 5,
            pauseCurrentTriggerTime: 2
        },
        // 暂停节点总数
        pauseTriggerTime: 3,
        // 客场队伍
        awayTeam: {
            name: '客场队伍',
            score: 99,
            foulTriggerTime: 5
        },
        // 比赛节数
        quarter: 'Quarter 1',
        // 比赛时间
        time: '9:28'
    },

    methods: {
        fetchGameData () {},

        handleScorePlus () {
            // const getScoreAnimation = this.selectComponent('#home-score-ani')
            // console.log(getScoreAnimation)
            // getScoreAnimation.onScoreChange(3)

            this.data.homeTeam.foulTriggerTime++

            this.setData({
                homeTeam: this.data.homeTeam
            })
        }
    },

    lifetimes: {
        created() {
        }
    }
});
