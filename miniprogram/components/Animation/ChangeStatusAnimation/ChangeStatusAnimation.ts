Component({
    properties: {
        // 排序 升序asc 倒序desc
        order: {
            type: String,
            value: 'asc'
        },

        // 记录次数
        triggerTime: {
            type: Number,
            value: 0
        },

        // 步长
        step: {
            type: Number,
            value: 1
        }
    },
    data: {
        // 动画状态
        animating: false,
        // 当前触发次数
        currentTriggerTime: 0
    },
    methods: {
        // 添加犯规动画方法
        start() {
            if (this.data.animating) return;  // 防止动画重叠

            // 判断正序还是倒序
            this.data.currentTriggerTime = this.properties.order === 'desc'
                ? this.data.currentTriggerTime - this.properties.step
                : this.data.currentTriggerTime + this.properties.step

            if (this.data.currentTriggerTime < 0 || this.data.currentTriggerTime > this.properties.triggerTime) return;

            // 设置动画状态
            this.setData({
                animating: true,
                currentTriggerTime: this.data.currentTriggerTime
            });

            // 动画结束后重置状态
            setTimeout(() => {
                this.setData({
                    animating: false
                });
            }, 400);
        }
    },

    lifetimes: {
        created() {
            this.properties.order === 'desc'
                ? this.data.currentTriggerTime = this.properties.triggerTime
                : this.data.currentTriggerTime = 0
        }
    }
});
