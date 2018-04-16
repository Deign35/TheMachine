declare const SOS_LIB_PREFIX = '_';
declare const sos: any;
declare const Stats: any;

declare const DEFAULT_PRIORITY: number;

declare const LOG_FATAL = 5;
declare const LOG_ERROR = 4;
declare const LOG_WARN = 3;
declare const LOG_INFO = 2;
declare const LOG_DEBUG = 1;
declare const LOG_TRACE = 0;

declare type PID = number;

declare var Logger: {
    log(message: string, severity?: number, tags?: { [id: string]: any }): void;
    logData(data: any, severity: string): void;
}
declare var kernel: {
    scheduler: IScheduler;
    start(): void;
    cleanMemory(): void;
    run(): void;
    shutdown(): void;
}

declare interface IScheduler {
    memory: any;
    processCache: any;
    wakeSleepingProcesses(): void;
    shift(): void;
    getNextProcess(): PID;
    launchProcess(name: string, data: any, parent?: PID): PID;
    getNextPid(): PID;
    isPidActive(pid: PID): boolean;
    kill(pid: PID): void;
    sleep(pid: PID, ticks: number, self: boolean): void;
    wake(pid: PID): void;
    getProcessCount(): number;
    getCompletedProcessCount(): number;
    getPriorityForPid(pid: PID): number;
    getProcessForPid(pid: PID): IProcess;
    getProgramClass(program: string): any;
}

declare interface IProcess {
    pid: PID
    name: string
    data: any
    parent: string
    getPriority(): number;
    getDescriptor(): string;
    clean(): void;
    launchChildProcess(label: string, name: string, data: any): PID;
    getChildProcessPid(label: string): PID;
    isChildProcessRunning(label: string): boolean;
    launchProcess(label: string, name: string, data: any): PID;
    getProcessPid(label: string): PID;
    isProcessRunning(label: string): boolean;
    period(interval: number, label: string): boolean;
    sleep(ticks: number): void;
    suicide(): void;
    run(): void;
    main(): void;
}