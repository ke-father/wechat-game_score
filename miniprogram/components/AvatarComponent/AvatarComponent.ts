interface IData {
    initialText: string
}

interface IProperty {
    avatarUrl: String;
    nickname: String;
    showNickname: Boolean;
    showPosition: 'left' | 'right' | 'top' | 'bottom';
}

interface IMethod {}

// @ts-ignore
// @ts-ignore
Component<IData, IProperty, IMethod>({
    options: {
        multipleSlots: true, // 支持多slot
    },

    properties: {
        // 头像图片链接
        avatarUrl: {
            type: String,
            value: '../../assets/images/basketBallTeam/CLE_logo.svg'
        },

        // 昵称
        nickname: {
            type: String,
            value: '昵称'
        },

        // 是否展示昵称
        showNickname: {
            type: Boolean,
            value: true
        },

        // 头像展示位置
        showPosition: {
            type: String,
            value: 'left'
        }
    },

    data: {
        // initialText: (this.properties.nickname as string)?.slice(0, 1)
        initialText: '',
    },

    pageLifetimes: {
        show() {
            console.log('avatarComponent show: ', this.properties.nickname)
            this.setData({
                // @ts-ignore
                initialText: this.properties.nickname.slice(0, 1)
            })
        }
    },

    methods: {}
});
