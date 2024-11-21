import Singleton from "../base/Singleton";
import Storage from "../utils/storage";

const { setStorage, getStorage } = Storage()

// 会话session_key
const SESSION_KEY = Symbol('session_key')
// 用户唯一标识id
const OPEN_ID = Symbol('open_id')

class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    // 会话key
    #_sessionKey = getStorage<string>(String(SESSION_KEY))

    get sessionKey () {
        return this.#_sessionKey
    }

    set sessionKey (value) {

        this.#_sessionKey = value
        setStorage(String(SESSION_KEY), value).then()
    }

    // 用户唯一标识
    #_openId = getStorage<string>(String(OPEN_ID))

    get openId () {
        return this.#_openId
    }

    set openId (value) {
        this.#_openId = value
        setStorage(String(OPEN_ID), value).then()
    }


    #_tabbar = 0

    get tabbar() {
        return this.#_tabbar
    }

    set tabbar(value) {
        this.#_tabbar = value
    }
}

export default DataManager
