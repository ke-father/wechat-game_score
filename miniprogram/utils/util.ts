// 格式化时间
export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

// 格式化数字
const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

// 格式化params参数
export const formatParams = (url: string, params: any) => {
  const paramsUrl = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&')
  return url + (paramsUrl ? '?' + paramsUrl : '')
}

// rgb颜色转十六进制
export function rgbToHex (r: number, g: number, b: number) {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// 十六进制颜色转rgb
export function hexToRgb (hex: string) {
  hex = hex.slice(1);
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}
