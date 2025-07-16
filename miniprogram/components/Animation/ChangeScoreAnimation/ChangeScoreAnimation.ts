Component({
    properties: {
        // 初始化分数
        initScore: {
            type: Number,
            value: 0
        },
        // 动画配置
        propAnimationConfig: {
            type: Object
        }
    },

    data: {
        // 当前分数
        score: 0,
        // 获得分数
        scoreChange: 0,
        // 是否展示得分动画
        showScoreAnim: false,
        // 得分动画配置
        animationConfig: {
            // 加分动画时长
            scoreChangeDuration: 600,
            // 得分动画时长
            scoreDuration: 300,
            // 缩放大小
            animationStartScale: 0.8
        }
    },

    methods: {
        // 显示得分动画
        showScoreAnimation(score: number) {
            this.setData({
                scoreChange: score,
                showScoreAnim: true
            });
            const date = this.properties.propAnimationConfig.scoreChangeDuration
                ? this.properties.propAnimationConfig.scoreChangeDuration
                : this.data.animationConfig.scoreChangeDuration
            setTimeout(() => {
                this.setData({ showScoreAnim: false });
            }, date);  // 配合新的动画时长
        },

        // 在得分更新的地方调用动画
        onScoreChange(score: number) {
            console.log(this.data.score)
            this.showScoreAnimation(score);
            // 更新实际比分...
            // TODO 逐步加分
            let i = score
            const date = this.properties.propAnimationConfig.scoreDuration
                ? this.properties.propAnimationConfig.scoreDuration
                : this.data.animationConfig.scoreDuration
            let timer: number = setInterval(() => {
                if (i <= 0) return clearInterval(timer)
                console.log(i)
                this.setData({
                    score: ++this.data.score
                })
                console.log(this.data.score)
                i--
            }, date)
        },
    },

    lifetimes: {
        created() {
            this.setData({
                score: this.properties.initScore
            })
        }
    },

    externalClasses: ['show-score'],
    export () {
        return {
            onScoreChange: this.onScoreChange
        }
    }
});
