Component({
    properties: {},
    data: {
        // 主场队伍
        homeTeam: {
            name: '主场队伍',
            score: 99,
            avatarUrl: '/assets/images/basketBallTeam/CLE_logo.svg'
        },
        // 客场队伍
        awayTeam: {
            name: '客场队伍',
            score: 99,
            avatarUrl: '/assets/images/basketBallTeam/GSW_logo.svg'
        },
        // 比赛节数
        quarter: 'first',
        // 比赛时间
        time: '9:28'
    },

    methods: {
        fetchGameData () {},

        handleScorePlus () {
            const getScoreAnimation = this.selectComponent('#home-score-ani')
            getScoreAnimation.onScoreChange(3)
        }
    },

    lifetimes: {
        created() {
        }
    }
});
