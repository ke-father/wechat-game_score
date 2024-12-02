import request from '../utils/request'
import { API_BASE_URL } from '../config/config'

// 比赛状态枚举
export enum GameStatus {
  NOT_STARTED = 0,   // 未开始
  IN_PROGRESS = 1,   // 进行中
  PAUSED = 2,        // 暂停
  FINISHED = 3       // 已结束
}

// 队伍信息接口
export interface ITeam {
  teamId: number;
  teamName: string;
  teamLogo?: string;
  score: number;
  fouls: number;
  timeouts: number;
  isHome: boolean;   // 是否主队
}

// 比赛信息接口
export interface IGame {
  gameId: number;
  gameName: string;
  gameLogo: string;
  gameStatus: GameStatus;
  gameType: string;      // 比赛类型（如：3v3, 5v5等）
  startTime: string;     // 开始时间
  teams: ITeam[];        // 参赛队伍
  currentPeriod?: number;// 当前节数
  isFollowed?: boolean;  // 是否已关注
  isManaged?: boolean;   // 是否管理员
}

// 当前进行中的比赛响应接口
export interface ICurrentGameResponse {
  code: number;
  message: string;
  data: {
    hasGame: boolean;
    game?: IGame;
  }
}

/**
 * 获取当前进行中的比赛
 */
export const getCurrentGame = () => {
  return request.get<ICurrentGameResponse>({
    url: `${API_BASE_URL}/game/current`
  })
}

/**
 * 获取比赛详情
 */
export const getGameDetail = (gameId: number) => {
  return request.get<{code: number; message: string; data: IGame}>({
    url: `${API_BASE_URL}/game/${gameId}`
  })
}

/**
 * 更新比赛分数
 */
export const updateGameScore = (gameId: number, teamId: number, score: number) => {
  return request.post({
    url: `${API_BASE_URL}/game/${gameId}/score`,
    data: {
      teamId,
      score
    }
  })
}

/**
 * 更新犯规次数
 */
export const updateGameFoul = (gameId: number, teamId: number) => {
  return request.post({
    url: `${API_BASE_URL}/game/${gameId}/foul`,
    data: {
      teamId
    }
  })
}

/**
 * 使用暂停
 */
export const useGameTimeout = (gameId: number, teamId: number) => {
  return request.post({
    url: `${API_BASE_URL}/game/${gameId}/timeout`,
    data: {
      teamId
    }
  })
}
