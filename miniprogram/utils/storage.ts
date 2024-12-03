export default function (): { setStorage: <T> (key: string, data: T) => Promise<T>, getStorage: <T> (key: string) => T } {
    const setStorage = <T> (key: string, data: T): Promise<T> => {
        return new Promise((resolve, reject) => {
            wx.setStorage({
                key,
                data,
                encrypt: true,
                success: (res) => resolve(res as T),
                fail: (err) => reject(err)
            })
        })
    }

    const getStorage = (key: string) => {
        return wx.getStorageSync(key)
    }

    return {
        setStorage,
        getStorage
    }
}
