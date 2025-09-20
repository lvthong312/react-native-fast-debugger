// src/entities/NetworkLogEntity.ts
interface NetworkLogEntityProps {
    id: string;
    method: string;
    url: string;
    status?: any;
    requestData?: any;
    responseData?: any;
    startTime: number;
    endTime?: number;
    headers?: any
    params?: any
}
export class NetworkLogEntity {
    public id: string;
    public method: string;
    public url: string;
    public status?: any;
    public requestData?: any;
    public responseData?: any;
    public startTime: number;
    public endTime?: number;
    public headers?: any
    public params?: any
    constructor(dto: NetworkLogEntityProps) {
        this.id = dto.id;
        this.method = dto.method;
        this.url = dto.url;
        this.status = dto.status;
        this.requestData = dto.requestData;
        this.responseData = dto.responseData;
        this.startTime = dto.startTime;
        this.endTime = dto.endTime;
        this.headers = dto.headers
        this.params = dto.params
    }

    // Derived logic
    getDurationMs() {
        return this.endTime ? this.endTime - this.startTime : undefined;
    }

    get isSuccess() {
        return this.status !== undefined && this.status >= 200 && this.status < 300;
    }
    get isFailed() {
        return this.status === undefined || this.status >= 400;
    }
    get isPending() {
        return this.status === 'pending';
    }

    // Mutations
    update(data: Partial<NetworkLogEntity>) {
        Object.assign(this, data);
    }
}