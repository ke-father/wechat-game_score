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
        getData: 0,
        // 是否展示得分动画
        showScoreAnim: false,
        // 得分动画配置
        animationConfig: {
            // 加分动画时长
            scoreChangeDuration: 600,
            // 得分动画时长
            scoreDuration: 600,
            // 缩放大小
            animationStartScale: 0.8
        },
        viewStyle: {
            '$animation-duration': '0.6s',
            '$animation-start-scale': '0.8',
            '$animation-x': '10%',
            '$animation-y': '28%'
        }
    },

    methods: {
        // 显示得分动画
        showScoreAnimation(score: number) {
            this.setData({
                scoreChange: score,
                showScoreAnim: true
            });
            setTimeout(() => {
                this.setData({ showScoreAnim: false });
            }, this.properties.propAnimationConfig?.scoreChangeDuration || this.data.animationConfig.scoreChangeDuration);  // 配合新的动画时长
        },

        // 在得分更新的地方调用动画
        onScoreChange(score: number) {
            console.log(this.data.score)
            this.showScoreAnimation(score);
            // 更新实际比分...
            // TODO 逐步加分
            let i = score
            let timer: number = setInterval(() => {
                if (i <= 0) return clearInterval(timer)
                console.log(i)
                this.setData({
                    score: ++this.data.score
                })
                console.log(this.data.score)
                i--
            }, this.properties.propAnimationConfig?.scoreDuration || this.data.animationConfig.scoreDuration)
        },
    },

    lifetimes: {
        created() {
            this.setData({
                score: this.properties.initScore
            })
        },

        ready() {
            const query = this.createSelectorQuery()
            query.select('.get-score--container').boundingClientRect(rect => {
                const { top, left } = rect
                this.data.viewStyle['$animation-x'] = `${left}px`
                this.data.viewStyle['$animation-y'] = `${top}px`
                this.data.viewStyle['$animation-duration'] = `${this.properties.propAnimationConfig?.scoreDuration || this.data.animationConfig.scoreDuration}ms`
                this.data.viewStyle['$animation-start-scale'] = `${this.properties.propAnimationConfig?.animationStartScale || this.data.animationConfig.animationStartScale}`
            }).exec()
        }
    },

    export () {
        return {
            onScoreChange: this.onScoreChange
        }
    }
});
