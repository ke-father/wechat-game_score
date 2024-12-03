import SocketTask = WechatMiniprogram.SocketTask;

interface IItem {
    cb: Function;
    ctx: unknown;
}

export class MyWebsocket <IMessageKey = string> {
    // 链接地址
    baseUrl: string = ''
    // 链接
    ws: SocketTask = null!
    // 链接状态
    connected = false
    // 消息队列
    messageMap: Map<IMessageKey, IItem[]> = new Map()

    constructor(url: string) {
        this.baseUrl = url
    }

    connect () {
        return new Promise((resolve, reject) => {
            if (this.connected) return resolve(true)

            // 链接
            this.ws = wx.connectSocket({
                url: this.baseUrl
            })

            // 链接成功
            this.ws.onOpen((res) => {
                console.log('WebSocket连接已打开', res)
                this.connected = true
                resolve(res)
            })

            this.ws.onClose((res) => {
                console.log('WebSocket连接已关闭', res)
                this.connected = false
                reject(res)
            })

            this.ws.onError((err) => {
                console.log('WebSocket连接打开失败', err)
                reject(err)
            })

            this.ws.onMessage((res) => {
                try {
                    const json = JSON.parse(res.data as string)
                    const { name, data } = json

                    if (this.messageMap.has(name)) {
                        this.messageMap.get(name)!.forEach(({ cb, ctx }) => {
                            cb.call(ctx, [data])
                        })
                    }
                } catch (e) {
                    console.log('链接错误', e)
                    reject(e)
                }
            })
        })
    }

    callApi <ICallName extends IMessageKey, ICallData = any> (name: ICallName, data: ICallData) {
        return new Promise((resolve, reject) => {
            try {
                let timer = setInterval(() => {
                    throw new Error('TIME OUT')
                }, 5000)

                const cb = (res: any) => {
                    resolve(res)
                    timer && clearInterval(timer)
                    this.unListenerMsg(name, cb, null)
                }

                this.listenerMsg(name, cb, null)
                this.sendMsg<ICallName>(name, data)
            } catch (e) {
                reject({
                    success: false,
                    error: new Error('TIME OUT')
                })
            }
        })
    }

    sendMsg <ISendName = string, ISendData = any> (name: ISendName, data: ISendData) {
        const json = JSON.stringify({
            name, data
        })

        // 发送数据
        this.ws.send({
            data: json
        })
    }

    listenerMsg <IListenerName extends IMessageKey, IListenCb = any> (name: IListenerName, cb: (...args: IListenCb[]) => void, ctx: unknown): void {
        if (this.messageMap.has(name)) {
            this.messageMap.get(name)!.push({ cb, ctx })
        } else {
            this.messageMap.set(name, [{ cb, ctx }])
        }
    }

    unListenerMsg (name: IMessageKey, cb: Function, ctx: unknown) {
        if (this.messageMap.has(name)) {
            const index = this.messageMap.get(name)!.findIndex((item) => item.cb === cb && item.ctx === ctx)
            index > -1 && this.messageMap.get(name)!.splice(index, 1)
        }
    }
}
