interface ITeam {
    logo: string;
    name: string;
    score: number;
    timeoutsLeft: number;
}

interface IRunGameData {
    homeTeam: ITeam;
    awayTeam: ITeam;
    gameStatus: 'waiting' | 'playing' | 'paused' | 'finished';
    currentPlayer: number | null;
    showPlayerDrawer: boolean;
    gameProgress: number;
    playerStats: {
        points: number;
        fouls: number;
        fieldGoals: string;
        freeThrows: string;
    }[];
    playerAvatars: string[];
    touchStartY: number;
    isDragging: boolean;
}

interface IRunGameCustom {
    onBackClick: () => void;
    onModifyGameNameAndLogo: () => void;
    onStartGame: () => void;
    onPauseGame: () => void;
    onFoul: () => void;
    onScore: (e: WechatMiniprogram.TouchEvent) => void;
    selectPlayer: (e: WechatMiniprogram.TouchEvent) => void;
    showPlayerDrawer: () => void;
    onPlayerDrawerClose: () => void;
    selectPlayerFromDrawer: (e: WechatMiniprogram.TouchEvent) => void;
    handleTouchStart: (e: WechatMiniprogram.TouchEvent) => void;
    handleTouchMove: (e: WechatMiniprogram.TouchEvent) => void;
    handleTouchEnd: (e: WechatMiniprogram.TouchEvent) => void;
    handlePlayerTap: (e: WechatMiniprogram.TouchEvent) => void;
}

Page<IRunGameData, IRunGameCustom>({
    data: {
        homeTeam: {
            logo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/CLE_logo.svg",
            name: "Warriors",
            score: 102,
            timeoutsLeft: 2
        },
        awayTeam: {
            logo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/GSW_logo.svg",
            name: "Rockets",
            score: 98,
            timeoutsLeft: 1
        },
        gameStatus: 'playing',
        currentPlayer: null,
        showPlayerDrawer: false,
        gameProgress: 35,
        playerStats: [
            { points: 23, fouls: 2, fieldGoals: '8/12', freeThrows: '5/6' },
            { points: 18, fouls: 1, fieldGoals: '7/10', freeThrows: '3/4' },
            { points: 15, fouls: 3, fieldGoals: '6/9', freeThrows: '2/2' },
            { points: 12, fouls: 2, fieldGoals: '5/8', freeThrows: '1/2' }
        ],
        playerAvatars: [
            'https://example.com/player1.jpg',
            'https://example.com/player2.jpg',
            'https://example.com/player3.jpg',
            'https://example.com/player4.jpg'
        ],
        touchStartY: 0,
        isDragging: false
    },

    onBackClick() {
        console.log(111)
        wx.navigateBack();
    },

    onModifyGameNameAndLogo() {
        // TODO: 实现修改比赛名称和logo的功能
        console.log('修改比赛名称和logo');
    },

    onStartGame() {
        this.setData({ gameStatus: 'playing' });
    },

    onPauseGame() {
        this.setData({ gameStatus: 'paused' });
    },

    onFoul() {
        // TODO: 实现犯规记录功能
        console.log('记录犯规');
    },

    onScore(e: WechatMiniprogram.TouchEvent) {
        const points = parseInt(e.currentTarget.dataset.points);
        const currentTeam = 'homeTeam'; // TODO: 根据实际选中的队伍确定

        this.setData({
            [`${currentTeam}.score`]: this.data[currentTeam].score + points
        });
    },

    selectPlayer(e: WechatMiniprogram.TouchEvent) {
        // 阻止事件冒泡
        const player = e.currentTarget.dataset.player;
        this.setData({ currentPlayer: player });
    },

    showPlayerDrawer() {
        this.setData({ showPlayerDrawer: true });
    },

    onPlayerDrawerClose() {
        this.setData({ showPlayerDrawer: false });
    },

    selectPlayerFromDrawer(e: WechatMiniprogram.TouchEvent) {
        const player = e.currentTarget.dataset.player;
        this.setData({
            currentPlayer: player,
            showPlayerDrawer: false
        });
    },

    // 处理触摸开始
    handleTouchStart(e: WechatMiniprogram.TouchEvent) {
        this.setData({
            touchStartY: e.touches[0].clientY
        });
    },

    // 处理触摸移动
    handleTouchMove(e: WechatMiniprogram.TouchEvent) {
        const touchY = e.touches[0].clientY;
        const moveDistance = this.data.touchStartY - touchY;

        // 如果向上拖动超过50px，标记为正在拖动
        if (moveDistance > 50 && !this.data.isDragging) {
            this.setData({ isDragging: true });
        }
    },

    // 处理触摸结束
    handleTouchEnd() {
        if (this.data.isDragging) {
            this.setData({
                showPlayerDrawer: true,
                isDragging: false
            });
        }
        this.setData({ touchStartY: 0 });
    },

    // 处理点击队员
    handlePlayerTap(e: WechatMiniprogram.TouchEvent) {
        console.log(e)
        // 阻止事件冒泡，确保点击队员时不会触发拖动事件
        // e.stopPropagation();
    }
});
