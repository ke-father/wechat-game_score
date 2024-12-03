import { IGame, GameStatus } from '../api/game'

export const mockCurrentGame: IGame = {
  gameId: 1,
  gameName: "3V3篮球赛",
  gameLogo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/basketBall_logo.png",
  gameStatus: GameStatus.IN_PROGRESS,
  gameType: "3v3",
  startTime: "2024-03-20 14:30:00",
  currentPeriod: 2,
  isFollowed: true,
  isManaged: true,
  teams: [
    {
      teamId: 1,
      teamName: "红队",
      teamLogo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/CLE_logo.svg",
      score: 21,
      fouls: 3,
      timeouts: 2,
      isHome: true
    },
    {
      teamId: 2,
      teamName: "蓝队",
      teamLogo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/GSW_logo.svg",
      score: 18,
      fouls: 2,
      timeouts: 1,
      isHome: false
    }
  ]
}

// 模拟API响应
export const mockCurrentGameResponse = {
  code: 0,
  message: "success",
  data: {
    hasGame: true,
    game: mockCurrentGame
  }
}
