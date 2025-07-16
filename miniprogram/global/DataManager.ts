// import Singleton from "../base/Singleton";
import Storage from "../utils/storage";

const { setStorage, getStorage } = Storage()

// 会话session_key
const SESSION_KEY = Symbol('session_key')
// 用户唯一标识id
const TOKEN = Symbol('token')

class DataManager {
    private _loginStatus: boolean;
    private _token: string;
    private _sessionKey: string;
    private _tabbar: number;
    constructor() {
        this._loginStatus = false
        this._token = getStorage<string>(String(TOKEN))
        // 会话key
        this._sessionKey = getStorage<string>(String(SESSION_KEY))
        this._tabbar = 0
    }

    get Instance() {
        return this
    }

    get loginStatus() {
        return this._loginStatus
    }

    set loginStatus(value) {
        this._loginStatus = value
    }

    get sessionKey () {
        return this._sessionKey
    }

    set sessionKey (value) {

        this._sessionKey = value
        setStorage(String(SESSION_KEY), value).then()
    }

    get token () {
        return this._token
    }

    set token (value) {
        this._token = value
        setStorage(String(TOKEN), value).then()
    }


    get tabbar() {
        return this._tabbar
    }

    set tabbar(value) {
        this._tabbar = value
    }
}

const dataManager = new DataManager()

export default dataManager
