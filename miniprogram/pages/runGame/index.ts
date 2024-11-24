interface IRunGameData {}

interface IRunGameCustom {
    // 回退
    onBackClick: () => void
    // 修改比赛名称与比赛logo
    onModifyGameNameAndLogo: () => void
}

Page<IRunGameData, IRunGameCustom>({
    data: {},

    onBackClick () {
        console.log('back')
        wx.navigateBack()
            .then()
    },

    onModifyGameNameAndLogo () {
        console.log('onModifyGameNameAndLogo')
    },

    onLoad: function (options) {
        console.log(options)
    }
});
