export type IFormatDate = (date: number, format?: string) => string

export const formatDate: IFormatDate = (date) => {
    console.log(date)
    const hour = parseInt(String(date / 60 / 60 / 1000)).toString().padStart(2, '0')
    const minute = parseInt(String(date / 60 / 1000)).toString().padStart(2, '0')
    const second = (date / 1000 % 60).toString().padStart(2, '0')

    let resultStr = ''

    if (hour !== '00') resultStr = `${hour}:${minute}:${second}`
    else resultStr = `${minute}:${second}`

    console.log(resultStr)
    return resultStr
}
