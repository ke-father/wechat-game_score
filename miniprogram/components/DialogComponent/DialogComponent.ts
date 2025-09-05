interface IDialogData {
    // 控制弹框
    visible: boolean
    showButtons: Array<IButtonConfig>;
    dialogTitle: string
}

type IButtonConfig = {
    text: string;
    type: 'confirm' | 'cancel';
}

interface IDialogProperty {
    // 是否展示遮罩
    showModal: string
    // 弹框标题
    title: string;
    // 弹框按钮
    dialogButtons: Array<IButtonConfig>;
}

interface IDialogMethod {
    open: (params?: any) => void
    // 关闭弹框
    close: () => void
}

// @ts-ignore
Component<IDialogData, IDialogProperty, IDialogMethod>({
    data: {
        visible: false,
        dialogTitle: ''
    },

    options: {
        multipleSlots: true
    },

    properties: {
        showModal: {
            type: Boolean,
            value: false
        },
        title: {
            type: String,
            value: '提示'
        },
        dialogButtons: {
            type: Array
        }
    },

    methods: {
        open (params = {}) {
            this.data.dialogTitle = params.title || this.properties.title
            this.setData({
                dialogTitle: this.data.dialogTitle,
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
