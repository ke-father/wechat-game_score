// API 基础配置
export const API_BASE_URL = 'http://localhost:4949';  // 这里替换为实际的API地址

// 环境配置
export const ENV = {
  development: true,  // 是否为开发环境
  mock: true         // 是否使用mock数据
};

// 其他全局配置
export const CONFIG = {
  maxFouls: 5,       // 最大犯规数
  maxTimeouts: 3,    // 最大暂停数
  defaultGamePeriods: 4  // 默认比赛节数
};
