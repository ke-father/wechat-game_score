interface IDialogData {
    // 控制弹框
    visible: boolean
    showButtons: Array<IButtonConfig>;
}

type IButtonConfig = {
    text: string;
    type: 'confirm' | 'cancel';
}

interface IDialogProperty {
    // 是否展示遮罩
    showModal: string
    // 弹框标题
    dialogTitle: string;
    // 弹框按钮
    dialogButtons: Array<IButtonConfig>;
}

interface IDialogMethod {
    // 关闭弹框
    handleDialogClose: () => void
}

// @ts-ignore
Component<IDialogData, IDialogProperty, IDialogMethod>({
    data: {
        visible: false,
    },

    options: {
        multipleSlots: true
    },

    properties: {
        showModal: {
            type: Boolean,
            value: false
        }
        // dialogTitle: {
        //     type: String,
        //     value: '提示'
        // },
        // dialogButtons: {
        //     type: Array
        // }
    },

    methods: {
        open () {
            console.log(11111111)
            this.setData({
                visible: true
            })
        },

        close () {
            this.setData({
                visible: false
            })
        },
    }
});
