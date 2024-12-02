import { IGame, GameStatus } from '../api/game'

export const mockCurrentGame: IGame = {
  gameId: 1,
  gameName: "3V3篮球赛",
  gameLogo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/images/basketBallTeam/basketBall_logo.png?Expires=1732965615&OSSAccessKeyId=TMP.3KjxmvnPj6Pj9hR8gXdGirWTd2SLgCAhLVohWmYopQfhEjrRfZ8McVKJrvH8a26dbV6Ju52adZtnweQaH32vEWq7wjhWcv&Signature=A9ibovgPeM3e068ZA0gKmzjcHVM%3D",
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
      teamLogo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/images/basketBallTeam/GSW_logo.svg?Expires=1732965777&OSSAccessKeyId=TMP.3KjxmvnPj6Pj9hR8gXdGirWTd2SLgCAhLVohWmYopQfhEjrRfZ8McVKJrvH8a26dbV6Ju52adZtnweQaH32vEWq7wjhWcv&Signature=x8TaOKAMOu4rh3AaDwuV9WW4%2Bzk%3D",
      score: 21,
      fouls: 3,
      timeouts: 2,
      isHome: true
    },
    {
      teamId: 2,
      teamName: "蓝队",
      teamLogo: "https://aprnine-game-score-application.oss-cn-nanjing.aliyuncs.com/base/basketball/images/basketBallTeam/CLE_logo.svg?Expires=1732965798&OSSAccessKeyId=TMP.3KjxmvnPj6Pj9hR8gXdGirWTd2SLgCAhLVohWmYopQfhEjrRfZ8McVKJrvH8a26dbV6Ju52adZtnweQaH32vEWq7wjhWcv&Signature=GvbE6e9v1VtuMEVnxLLBUnqF60E%3D",
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
