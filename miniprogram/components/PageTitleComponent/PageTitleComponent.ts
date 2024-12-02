interface IPageTitleData {
    // 状态栏高度
    statusBarHeight: number;
}

type PropertyType = StringConstructor | BooleanConstructor;

type IPageTitleProperty = {
    title: {
        type: StringConstructor;
        value?: string;
    };
    showBack: {
        type: BooleanConstructor;
        value?: boolean;
    };
    background: {
        type: StringConstructor;
        value?: string;
    };
}

interface IPageTitleMethod {
    // 操作倒退
    handleBack: () => void;
    // 添加字符串索引签名
    [key: string]: (...args: any[]) => any;
}

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
            value: ''
        },
        background: {
            type: String,
            value: '#fff'
        }
    },

    data: {
        statusBarHeight: 0
    },

    lifetimes: {
        attached() {
            // 获取状态栏高度
            const systemInfo = wx.getSystemInfoSync();
            this.setData({
                statusBarHeight: systemInfo.statusBarHeight
            });
        }
    },

    methods: {
        handleBack() {
            this.triggerEvent('onBackClick');
        }
    }
});
