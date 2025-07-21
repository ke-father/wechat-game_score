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
    properties: {
        avatarUrl: {
            type: String,
            value: '../../assets/images/basketBallTeam/CLE_logo.svg'
        },

        nickname: {
            type: String,
            value: '昵称'
        },

        showNickname: {
            type: Boolean,
            value: true
        },

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
