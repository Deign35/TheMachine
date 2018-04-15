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


declare var Logger: {
    log(message: string, severity?: number, tags?: { [id: string]: any }): void;
    logData(data: any, severity: string): void;
}
declare var kernel: {
    scheduler: Scheduler;
    start(): void;
    cleanMemory(): void;
    run(): void;
    shutdown(): void;
}

declare class Scheduler {
    memory: any;
    processCache: any;
    wakeSleepingProcesses(): void;
    shift(): void;
    getNextProcess(): number;
    launchProcess(name: string, data: any, parent: number): void;
    getNextPid(): number;
    isPidActive(pid: number): boolean;
    kill(pid: number): void;
    sleep(pid: number, ticks: number, self: boolean): void;
    wake(pid: number): void;
    getProcessCount(): number;
    getCompletedProcessCount(): number;
    getPriorityForPid(pid: number): number;
    getProcessForPid(pid: number): any;
    getProgramClass(program: number): any;
}

declare class Process {
    pid: number
    name: string
    data: any
    parent: string
    getPriority(): number;
    getDescriptor(): string;
}