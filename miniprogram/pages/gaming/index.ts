import {GAME_STATUS} from "../../types/gameStatus";
import watch from "../../utils/dataUtils/watch";
import {formatDate} from "../../utils/date/formatDate";

// 队员
interface IMember {
    // 名称
    name: string;
    // logo
    logo?: string;
    // 号码
    numberPlate: number;
    // 位置 PG-控球后卫 SG-控球后卫 SF-控球前卫 PF-控球前卫 C-中锋
    position?: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
    // 选中
    selected?: boolean;
    // 得分
    score: number;
    // 犯规
    foul: number;

}

// 队伍
interface ITeam {
    logo: string;
    name: string;
    score: number;
    pauseTriggerTime: number;
    foulTriggerTime: number;
    selected: boolean;
    member?: IMember[];
}

interface IGame {
    // 比赛名称
    gameName: string;
    // 比赛logo
    gameLogo?: string;
    // 比赛 节点
    point: number
    // 单场比赛时间
    date: number
    // 用于展示的字段
    showDate: string
    // 已进行比赛时间
    time: number
    // 用于展示的字段
    showTime: string
    // 比赛计时器
    showTimer: any
}

interface IRunGameData {
    // 比赛信息
    game: IGame
    // 展示队伍透明度 选择
    selectedOpacity: number
    // 暂停触发次数
    pauseTriggerTime: number
    // 犯规暂停次数
    foulTriggerTime: number
    homeTeam: ITeam;
    awayTeam: ITeam;
    // 比赛状态
    gameStatus: GAME_STATUS;
    showGameStatus: string
    // 当前选择队伍
    currentTeam: 'homeTeam' | 'awayTeam' | undefined;
    // 当前选择队员
    currentPlayer: number | null;
    // 展示队员选择抽屉
    showPlayerDrawer: boolean;
    // 比赛进度
    gameProgress: number;
    // 比赛节点
    playerStats: {
        points: number;
        fouls: number;
        fieldGoals: string;
        freeThrows: string;
    }[];
    // 队员展示
    playerAvatars: string[];
    touchStartY: number;
    isDragging: boolean;
}

interface IRunGameCustom {
    onBackClick: () => void;
    onModifyGameNameAndLogo: () => void;
    onClickGame: (e: WechatMiniprogram.TouchEvent) => void;
    onPauseGame: (e: WechatMiniprogram.TouchEvent) => void;
    // 犯规
    onFoul: (e: WechatMiniprogram.TouchEvent) => void;
    // 得分
    onScore: (e: WechatMiniprogram.TouchEvent) => void;
    selectPlayer: (e: WechatMiniprogram.TouchEvent) => void;
    showPlayerDrawer: () => void;
    onPlayerDrawerClose: () => void;
    selectPlayerFromDrawer: (e: WechatMiniprogram.TouchEvent) => void;
    handleTouchStart: (e: WechatMiniprogram.TouchEvent) => void;
    handleTouchMove: (e: WechatMiniprogram.TouchEvent) => void;
    handleTouchEnd: (e: WechatMiniprogram.TouchEvent) => void;
    handlePlayerTap: (e: WechatMiniprogram.TouchEvent) => void;
    handleInput: (e: WechatMiniprogram.Input) => void;
    handleGlobalClick: (e: WechatMiniprogram.Input) => void;
    handleTeamClick: (e: WechatMiniprogram.Input) => void;
    /**
     * 监听比赛状态变化
     * @param newValue 新状态
     * @param oldValue 旧状态
     */
    listenGameStatusChange: (newValue: any, oldValue?: any) => void;
    // 操作比赛状态 —— 暂停
    handlePauseGame: () => void
    // 操作比赛状态 —— 进行
    handlePlayingGame: () => void
}

Page<IRunGameData, IRunGameCustom>({
    onHide(): void | Promise<void> {
        return undefined;
    },
    data: {
        game: {
            gameLogo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/basketBall_logo.png",
            gameName: "篮球联赛",
            point: 1,
            date: 10 * 60 * 1000,
            showDate: '',
            time: 5 * 60 * 1000,
            showTime: '',
            showTimer: null
        },
        selectedOpacity: .7,
        pauseTriggerTime: 3,
        foulTriggerTime: 5,
        homeTeam: {
            logo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/CLE_logo.svg",
            name: "Warriors",
            score: 102,
            pauseTriggerTime: 0,
            foulTriggerTime: 0,
            // 是否选中
            selected: false,
            member: Array.from({length: 5}, () => ({
                name: 'Warriors',
                logo: 'https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/CLE_logo.svg',
                numberPlate: 0,
                position: 'PG',
                score: 0,
                foul: 0
            }))
        },
        awayTeam: {
            logo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/GSW_logo.svg",
            name: "Rockets",
            score: 98,
            pauseTriggerTime: 0,
            foulTriggerTime: 0,
            // 是否选中
            selected: false
        },
        gameStatus: GAME_STATUS.WAITING,
        showGameStatus: '开始',
        currentTeam: undefined,
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

    // 生命周期 —— 挂载成功后
    onReady(): void | Promise<void> {
        watch(this, {
            'gameStatus': {
                target: this.data,
                handler: this.listenGameStatusChange
            }
        })

        // this.data.game.showTime = formatDate(this.data.game.time)
        // this.data.game.showDate = formatDate(this.data.game.date)

        this.setData({
            'game.showTime': formatDate(this.data.game.time),
            'game.showDate': formatDate(this.data.game.date)
        })
    },

    listenGameStatusChange (newValue: GAME_STATUS) {
        switch (newValue) {
            case GAME_STATUS.PLAYING:
                this.handlePlayingGame()
                break
            case GAME_STATUS.PAUSED:
                this.handlePauseGame()
                break
        }
    },

    handlePlayingGame () {
        this.data.game.showTimer && clearInterval(this.data.game.showTimer)
        // 比赛开始
        this.setData({
            showGameStatus: '暂停'
        })
        this.data.game.showTimer = setInterval(() => {
            this.data.game.time -= 1000
            this.data.game.showTime = formatDate(this.data.game.time)
            this.setData({
                game: this.data.game
            })
        }, 1000)
    },

    handlePauseGame () {
        this.data.game.showTimer && clearInterval(this.data.game.showTimer)
        // 比赛开始
        this.setData({
            showGameStatus: '开始'
        })
    },

    onBackClick() {
        wx.navigateBack();
    },

    onModifyGameNameAndLogo() {
        // TODO: 实现修改比赛名称和logo的功能
        console.log('修改比赛名称和logo');
    },

    onClickGame() {
        let status = this.data.gameStatus === GAME_STATUS.PLAYING ? GAME_STATUS.PAUSED : GAME_STATUS.PLAYING
        this.setData({ gameStatus: status });
    },

    // 暂停
    onPauseGame(e: WechatMiniprogram.TouchEvent) {
        const team: 'homeTeam' | 'awayTeam'  = e.currentTarget.dataset.team
        // 获取当前队伍暂停次数
        const currentTeamPauseTriggerTime = this.data[team].pauseTriggerTime + 1
        // 如果当前队伍暂停次数大于设置的触发次数，直接返回
        if (currentTeamPauseTriggerTime > this.data.pauseTriggerTime) return
        // 更新数据
        this.data[team].pauseTriggerTime = currentTeamPauseTriggerTime

        // 更新视图
        this.setData({
            [team]: this.data[team]
        })
    },

    onFoul(e: WechatMiniprogram.TouchEvent) {
        const team = e.currentTarget.dataset.team
        const currentTeamFoulTriggerTime = this.data[team as 'homeTeam' | 'awayTeam'].foulTriggerTime + 1

        this.setData({
            [`${team}.foulTriggerTime`]: currentTeamFoulTriggerTime
        })
    },

    onScore(e: WechatMiniprogram.TouchEvent) {
        // 获取得分节点
        const points = parseInt(e.currentTarget.dataset.points);
        // 获取得分队伍
        const team = e.currentTarget.dataset.team
        // 获取当前队伍得分
        const currentScore = this.data[team as 'homeTeam' | 'awayTeam'].score
        this.setData({
            [`${team}.score`]: currentScore + points
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
    },

    // 处理队伍名称输入
    handleInput () {

        // return {
        //     // @ts-ignore
        //     value: this.data[team].name
        // }
    },

    // 关于全局点击操作
    handleGlobalClick () {
        // 去除队伍选择
        this.data.homeTeam.selected = false
        this.data.awayTeam.selected = false
        this.data.currentTeam = undefined

        this.setData({
            homeTeam: this.data.homeTeam,
            awayTeam: this.data.awayTeam
        })
    },

    // 关于队伍点击
    handleTeamClick (e) {
        // 获取绑定数据
        const { team } = e.currentTarget.dataset

        // 获取另一个数据内容
        const otherTeam = team === 'homeTeam' ? 'awayTeam' : 'homeTeam'
        const teamName = team === 'homeTeam' ? 'homeTeam' : 'awayTeam'
        this.data[otherTeam].selected = false
        this.data[teamName].selected = true
        this.data.currentTeam = team

        this.setData({
            [otherTeam]: this.data[otherTeam],
            [teamName]: this.data[teamName]
        })
    }
});
