// 游戏阶段
export enum GAME_STATUS {
    // 等待
    WAITING = 'WAITING',
    // 比赛中
    PLAYING = 'PLAYING',
    // 暂停
    PAUSED = 'PAUSED',
    // 结束
    END = 'END'
}

// 位置相关
export enum POKER_POSITION_TYPE {
    // 小盲
    BB = 'BB',
    // 大盲
    SB = 'SB',
    // 枪口
    UTG = 'UTG',
    // 中位
    MP = 'MP',
    // 劫位
    HJ = 'HJ',
    // 关位
    CO = 'CO',
    // 庄家
    BTN = 'BTN'
}

// 行为
export enum POKER_BEHAVIOR_TYPE {
    // 跟注
    CALL = 'CALL',
    // 加注
    RAISE = 'RAISE',
    // 弃牌
    FOLD = 'FOLD',
    // All In
    ALL_IN = 'ALL_IN',
    // 过牌
    CHECK = 'CHECK',
    // 等待
    WAIT = 'WAIT'
}

// 行动
export enum POKER_ACTION_TYPE {
    // 翻前
    PRE_FLOP = 'PRE_FLOP',
    // 翻后
    FLOP = 'FLOP',
    // 转牌
    TURN = 'TURN',
    // 河牌
    RIVER = 'RIVER'
}

export enum POKER_COMMON_TYPE {
    // 公共牌
    COMMON_CARDS = 'COMMON_CARDS',
    // 底牌
    HOLE_CARDS = 'HOLE_CARDS',
    // 底池
    POT = 'POT',
}

