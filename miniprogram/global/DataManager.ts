import Singleton from "../base/Singleton";

class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
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
