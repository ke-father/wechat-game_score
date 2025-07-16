interface IObserver {
    [key: string]: {
        target: any
        handler: (newValue: any, oldValue: any) => void
    }
}

/**
 * watch监听
 * @param ctx 上下文对象
 * @param observerObject 监听对象
 */
export default function (ctx: any, observerObject: IObserver) {
    for (let key in observerObject) {
        observer(ctx, key, observerObject[key].target, observerObject[key].handler)
    }
}

const observer = (ctx: any, key: string, data: any, callback: Function) => {
    // callback.call(ctx, data[key])
    let that = ctx
    let tmpData = data[key]
    Object.defineProperty(data, key, {
        set: function(value) {
            tmpData = value
            // 值变化了再执行一次
            callback.call(that, value)
        },
        get: function() {
            return tmpData
        }
    })
}



