export class Process {
    private priority?: number;
    constructor(public pid: number, public name: string, public data: any, public parent: string) {
    }

    getPriority() {
        return this.priority || DEFAULT_PRIORITY
    }

    clean() {
        if (this.data.children) {
            let keys = Object.keys(this.data.children);
            for (let i = 0; i < keys.length; i++) { // jshint ignore:line
                if (!kernel.scheduler.isPidActive(this.data.children[keys[i]])) {
                    delete this.data.children[keys[i]]
                }
            }
        }

        if (this.data.processes) {
            let keys = Object.keys(this.data.processes);
            for (let i = 0; i < keys.length; i++) { // jshint ignore:line
                if (!kernel.scheduler.isPidActive(this.data.processes[keys[i]])) {
                    delete this.data.processes[keys[i]]
                }
            }
        }
    }

    getDescriptor() {
        return false
    }

    launchChildProcess(label: string, name: string, data = {}) {
        if (!this.data.children) {
            this.data.children = {}
        }
        if (this.data.children[label]) {
            return true
        }
        this.data.children[label] = kernel.scheduler.launchProcess(name, data, this.pid)
        return this.data.children[label]
    }

    getChildProcessPid(label: string) {
        if (!this.data.children) {
            return false
        }
        if (!this.data.children[label]) {
            return false
        }
        return this.data.children[label]
    }

    isChildProcessRunning(label: string) {
        const pid = this.getChildProcessPid(label)
        if (!pid) {
            return false
        }
        return kernel.scheduler.isPidActive(pid)
    }

    launchProcess(label: string, name: string, data = {}) {
        if (!this.data.processes) {
            this.data.processes = {}
        }

        if (this.data.processes[label]) {
            return true
        }
        this.data.processes[label] = kernel.scheduler.launchProcess(name, data)
        return this.data.processes[label]
    }

    getProcessPid(label: string) {
        if (!this.data.processes) {
            return false
        }
        if (!this.data.processes[label]) {
            return false
        }
        return this.data.processes[label]
    }

    isProcessRunning(label: string) {
        const pid = this.getProcessPid(label)
        if (!pid) {
            return false
        }
        return kernel.scheduler.isPidActive(pid)
    }

    launchCreepProcess(label: string, role: string, roomname: string, quantity = 1, options = {}) {
        const room = Game.rooms[roomname]
        if (!room) {
            return false
        }
        if (!this.data.children) {
            this.data.children = {}
        }
        let x
        for (x = 0; x < quantity; x++) {
            const specificLabel = label + x
            if (this.data.children[specificLabel]) {
                continue
            }
            const creepName = room.queueCreep(role, options)
            this.launchChildProcess(specificLabel, 'creep', {
                'creep': creepName
            })
        }
    }

    getCluster(name: string, room: Room) {
        return new qlib.Cluster(`${name}_${this.pid}`, room)
    }

    period(interval: number, label = 'default') {
        if (!this.data.period) {
            this.data.period = {}
        }

        const lastRun = this.data.period[label] || 0
        if (lastRun < Game.time - interval) {
            this.data.period[label] = Game.time
            return true
        }

        return false
    }

    sleep(ticks: number) {
        kernel.scheduler.sleep(this.pid, ticks, true)
    }

    suicide() {
        return kernel.scheduler.kill(this.pid)
    }

    run() {
        this.clean()
        this.main()
    }
}