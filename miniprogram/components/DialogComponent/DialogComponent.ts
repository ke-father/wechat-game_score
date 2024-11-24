interface IDialogData {
    showButtons: Array<IButtonConfig>;
}

type IButtonConfig = {
    text: string;
    type: 'confirm' | 'cancel';
}

interface IDialogProperty {
    // 是否开启弹框
    openDialog: boolean;
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
    options: {
        multipleSlots: true
    },

    properties: {
        openDialog: {
            type: Boolean,
            value: false
        },
        // dialogTitle: {
        //     type: String,
        //     value: '提示'
        // },
        // dialogButtons: {
        //     type: Array
        // }
    },

    methods: {
        handleDialogClose () {
            this.triggerEvent('closeDialog', false)
        }
    }
});
