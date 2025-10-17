import { type NetworkLogEntity } from "./network-log-entity";

export class NetworkLogListEntity {
    public logs: NetworkLogEntity[] = []
    constructor(private readonly props: NetworkLogEntity[]) {
        this.logs = this.props
    }
    addLog(log: NetworkLogEntity) {
        this.logs.push(log)
    }

    updateLog(id: string, log: NetworkLogEntity) {
        const findLogIndex = this.logs?.findIndex?.((e) => e?.id == id)
        if (findLogIndex >= 0 && this.logs && this.logs[findLogIndex]) {
            this.logs[findLogIndex].status = log.status
            this.logs[findLogIndex].headers = log.headers
            this.logs[findLogIndex].responseData = log.responseData
            this.logs[findLogIndex].endTime = Date.now()
        }
    }
    clear() {
        this.logs = []
    }
    // Đếm số lượng log theo trạng thái
    get logCounts() {
        return {
            all: this.logs.length,
            pending: this.logs.filter((l: any) => l.isPending).length,
            success: this.logs.filter((l: any) => l.isSuccess).length,
            failed: this.logs.filter((l: any) => l.isFailed).length,
        };
    }

    // Lọc logs theo trạng thái
    filteredLogs(filterStatus: string) {
        let arr = [...this.logs].reverse()
        if (filterStatus === 'success') {
            return arr.filter((l: any) => l.isSuccess);
        }
        if (filterStatus === 'failed') {
            return arr.filter((l: any) => l.isFailed);
        }
        if (filterStatus === 'pending') {
            return arr.filter((l: any) => l.isPending);
        }
        return arr;
    }

}