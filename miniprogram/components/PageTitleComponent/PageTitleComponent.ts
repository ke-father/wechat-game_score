interface IPageTitleData {}

interface IPageTitleProperty {
    // 头部展示标题
    title: string
    // 是否展示返回按钮
    showBack: boolean,
    // 背景色
    background: string
}

interface IPageTitleMethod {
    // 操作倒退
    handleBack: () => void
}

// @ts-ignore
Component<IPageTitleData, IPageTitleProperty, IPageTitleMethod>({
    options: {
        multipleSlots: true
    },

    properties: {
        showBack: {
            type: Boolean,
            value: false
        },
        title: {
            type: String,
            value: '比赛记录'
        },
        background: {
            type: String,
            value: '#fff'
        }
    },

    data: {},

    methods: {
        handleBack () {
            this.triggerEvent('onBackClick')
        }
    }
});
