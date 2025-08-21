interface IData {}

interface IProperty {
    avatarUrl: String;
    nickname: String;
    showNickname: Boolean;
    showPosition: 'left' | 'right' | 'top' | 'bottom';
}

interface IMethod {}

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
    data: {},

    pageLifetimes: {
        show() {
            console.log(this.data, this.dataset)
        }
    },

    methods: {}
});
