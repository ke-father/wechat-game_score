Component({
    properties: {
        // 点颜色
        dotColor: {
            type: String,
            value: '#ff5722'
        },
        // 激活颜色
        activeDotColor: {
          type: String,
          value: '#ff5722'
        },
        // 排序 升序asc 倒序desc
        order: {
            type: String,
            value: 'asc'
        },

        // 记录次数
        triggerTime: {
            type: Number,
            value: 0,
            // observer: (newVal, oldVal, changedPath) => {
            //     console.log(newVal, oldVal, changedPath)
            // }
        },

        // 当前触发次数
        currentTriggerTime: {
            type: Number,
            value: 0,
            observer: function () {
                this.start()
            }
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
        // 当前样式
        elementDots: [
            {
                index: 0,
                active: false
            }
        ]
    },

    lifetimes: {
        attached() {
            this.start()
        }
    },

    methods: {
        // 添加犯规动画方法
        start() {
            if (this.data.animating) return;  // 防止动画重叠

            if (this.properties.currentTriggerTime < 0 || this.properties.currentTriggerTime > this.properties.triggerTime) return;

            this.changeDotsStatus()

            // 设置动画状态
            this.setData({
                animating: true,
                elementDots: this.data.elementDots
            });

            // 动画结束后重置状态
            setTimeout(() => {
                this.setData({
                    animating: false
                });
            }, 400);
        },

        changeDotsStatus () {
            // 创建节点元素
            this.data.elementDots = Array.from({ length: this.properties.triggerTime }, (_, index) => {
                const current = this.properties.currentTriggerTime - 1
                // 判断当前激活状态
                const status = this.properties.order === 'asc'
                    ? index <= current
                    : index >= current

                // const color = {
                //     asc: {},
                //     desc: {}
                // }
                //
                // // 设置样式
                // const style = {
                //     backgroundColor: status ? this.properties.activeDotColor : this.properties.dotColor,
                //     boxShadow: status ? `0 0 6rpx 2rpx ${this.properties.activeDotColor}` : `0 0 6rpx 2rpx ${this.properties.dotColor}`
                // }

                return {
                    index,
                    active: status,
                    // style
                }
            })
        },

        // handleColorShow (active: boolean, color: string, type: 'bg' | 'boxShadow') {
        //     let colorStr = ''
        //     if (active) {
        //         if (this.properties.order === 'desc') {
        //             colorStr = `${}`
        //         }
        //     }
        //
        //     return colorStr
        // }
    },

    externalClasses: ['dot-style', 'dot-active-style']
});
