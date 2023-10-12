import {makeAutoObservable} from 'mobx'

export default class TaskStore {
    constructor() {
        this._tasks = []
        this._executors = []
        this._bosses = []
        makeAutoObservable(this)
    }

    setTasks(tasks) {
        this._tasks = tasks
    }
    
    get tasks() {
        return this._tasks
    }

    setExecutors(executors) {
        this._executors = executors
    }
    
    get executors() {
        return this._executors
    }

    setBosses(bosses) {
        this._bosses = bosses
    }
    
    get bosses() {
        return this._bosses
    }
}