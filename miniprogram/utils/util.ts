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
