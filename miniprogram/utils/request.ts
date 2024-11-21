interface IResponse <T> {
    data: T
    status: boolean,
    message: string
}

export default new class {
    private BASE_URL = 'http://localhost:4949'

    private request (method: 'GET' | 'POST', url: string, data: object, resolve: Function, reject: Function) {
        wx.request({
            method,
            url: `${this.BASE_URL}${url}`,
            data,
            success: (res) => {
                console.log(res)
                resolve(res.data)
            },
            fail: (err) => {
                reject(err)
            }
        })
    }

    get <T> (url: string, data: object): Promise<IResponse<T>> {
        return new Promise((resolve, reject) => {
            this.request('GET', url, data, resolve, reject)
        })
    }

    post <T> (url: string, data: object): Promise<IResponse<T>> {
        return new Promise((resolve, reject) => {
            this.request('POST', url, data, resolve, reject)
        })
    }
}
