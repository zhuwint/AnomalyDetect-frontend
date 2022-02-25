import {Axios} from "../utils/request";
import {AxiosResponseData} from "./service_controller";
import {ModelService} from "./service_model";

export interface SimpleStatus {
    project_id: number;
    task_id: string;
    is_stream: boolean;
    model: string;
    sensor_mac: string;
    sensor_type: string;
    receive_no: string;
    update_enable: boolean;
    detect_enable: boolean;
    threshold_upper: number;
    threshold_lower: number;
    current_value: number;
    is_anomaly: boolean;
}

export const FetchTaskList = (projectId: string) => {
    return Axios.request<AxiosResponseData<SimpleStatus[]>>({
        method: "GET",
        url: "/controller/task",
        params: {
            projectId: projectId,
            isUnion: false,
        },
    }).then(res => res.data);
};


export interface SimpleUnionStatus {
    project_id: string;
    task_id: string;
    task_name: string;
    enable: boolean;
    is_anomaly: boolean;
}

export const FetchUnionTaskList = (projectId: string) => {
    return Axios.request<AxiosResponseData<SimpleUnionStatus[]>>({
        method: "GET",
        url: "/controller/task",
        params: {
            projectId: projectId,
            isUnion: true,
        },
    }).then(res => res.data);
};


export const EnableOrDisableTask = (taskId: string, projectId: string, isModelUpdate: boolean, enable: boolean) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "POST",
        url: "/controller/task/control",
        params: {
            taskId: taskId,
            projectId: projectId,
            isUpdate: isModelUpdate,
            enable: enable,
        },
    }).then(res => res.data);
};


export const DeleteTask = (taskId: string, projectId: string) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "DELETE",
        url: "/controller/task",
        params: {
            taskId: taskId,
            projectId: projectId,
        },
    }).then(res => res.data);
};


export interface UnvariedSeries {
    sensor_mac: string;
    receive_no: string;
    sensor_type: string;
}

export interface QueryOptions {
    range: { start: string, stop: string };
    aggregate: string;
    measurement: string;
}

export type BatchMeta = {
    interval: string;
    query: QueryOptions;
}

export type StreamMeta = {
    bucket: string;
    measurement: string;
    series: UnvariedSeries | null;
    duration: string;
}


export interface BatchTaskInfo {
    task_id: string;
    project_id: number;
    preprocess: ModelService | null;
    detect_model: ModelService | null;
    target: UnvariedSeries;
    independent: UnvariedSeries[];
    model_update: BatchMeta | null;
    anomaly_detect: BatchMeta | null;
    is_stream: boolean;
    level: number;
}

export interface StreamTaskInfo {
    task_id: string;
    project_id: number;
    preprocess: ModelService | null;
    detect_model: ModelService | null;
    target: UnvariedSeries;
    independent: UnvariedSeries[];
    model_update: BatchMeta | null;
    anomaly_detect: StreamMeta | null;
    is_stream: boolean;
    level: number;
}

export const CreateBatchTask = (info: BatchTaskInfo) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "POST",
        url: "/controller/task/batch",
        data: info,
    }).then(res => res.data);
};

export const CreateStreamTask = (info: StreamTaskInfo) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "POST",
        url: "/controller/task/stream",
        data: info,
    }).then(res => res.data);
};

export const UpdateBatchTask = (taskId: string, projectId: string, info: BatchTaskInfo) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "PUT",
        url: "/controller/task/batch",
        params: {
            taskId: taskId,
            projectId: projectId,
        },
        data: info,
    }).then(res => res.data);
};

export const UpdateStreamTask = (taskId: string, projectId: string, info: StreamTaskInfo) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "PUT",
        url: "/controller/task/stream",
        params: {
            taskId: taskId,
            projectId: projectId,
        },
        data: info,
    }).then(res => res.data);
};


export type UnionMeta = {
    sensor_mac: string
    sensor_type: string
    receive_no: string
    threshold_upper: number
    threshold_lower: number
}

export type UnionTaskInfo = {
    task_id: string
    task_name: string
    project_id: number
    bucket: string
    measurement: string
    series: UnionMeta[]
    operate: number[]
    duration: string
    is_stream: boolean
    level: number
}


export const CreateUnionTask = (info: UnionTaskInfo) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "POST",
        url: "/controller/task/union",
        data: info,
    }).then(res => res.data);
};


export const UpdateUnionTask = (taskId: string, projectId: string, info: UnionTaskInfo) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "PUT",
        url: "/controller/task/union",
        params: {
            taskId: taskId,
            projectId: projectId,
        },
        data: info,
    }).then(res => res.data);
};


export type UnionTaskStatus = {
    info: UnionTaskInfo
    created: string
    updated: string
    state: {
        [id: string]: {
            last: string,
            triggered: number,
            value: number
        }
    }
    enable: boolean
    is_anomaly: boolean
}

export const GetUnionTask = (taskId: string, projectId: string) => {
    return Axios.request<AxiosResponseData<UnionTaskStatus>>({
        method: "GET",
        url: "/controller/task",
        params: {
            taskId: taskId,
            projectId: projectId,
        },
    }).then(res => res.data);
};


export const SetThreshold = (taskId: string, projectId: string, lower: number | null, upper: number | null) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "POST",
        url: "/controller/task/set",
        params: {
            taskId: taskId,
            projectId: projectId,
        },
        data: {
            upper: upper,
            lower: lower,
        },
    }).then(res => res.data);
};

export const SetUnionThreshold = (taskId: string, projectId: string, sensorMac: string, sensorType: string,
                                  receiveNo: string, lower: number | null, upper: number | null) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "POST",
        url: "/controller/task/set",
        params: {
            taskId: taskId,
            projectId: projectId,
        },
        data: {
            sensor_mac: sensorMac,
            sensor_type: sensorType,
            receive_no: receiveNo,
            upper: upper,
            lower: lower,
        },
    }).then(res => res.data);
};


export type BatchState = {
    enable: boolean
    last: string
    next: string
    triggered: number
}

export type StreamState = {
    enable: boolean
    triggered: number
}

export type TaskStatus = {
    info: BatchTaskInfo | StreamTaskInfo
    created: string
    updated: string
    model_update: BatchState
    anomaly_detect: StreamState | BatchState
    threshold_upper: number
    threshold_lower: number
    current_value: number
    is_anomaly: boolean
}

export const FetchTask = (taskId: string, projectId: number) => {
    return Axios.request<AxiosResponseData<TaskStatus>>({
        method: "GET",
        url: "/controller/task",
        params: {
            taskId: taskId,
            projectId: projectId,
        },
    }).then(res => res.data);
};


export const FetchTaskWithTarget = (projectId: number, sensorMac: string, sensorType: string, receiveNo: string) => {
    return Axios.request<AxiosResponseData<SimpleStatus[]>>({
        method: "GET",
        url: "/controller/task/target",
        params: {
            projectId: projectId,
            sensorMac: sensorMac,
            sensorType: sensorType,
            receiveNo: receiveNo,
        },
    }).then(res => res.data);
};


export type ComputeReq = {
    project_id: number;
    preprocess: ModelService | null;
    detect_model: ModelService | null;
    target: UnvariedSeries;
    independent: UnvariedSeries[];
    model_update: BatchMeta | null;
}

export type ComputeResp = {
    threshold_lower: number | null
    threshold_upper: number | null
    eigen_value: number | null
    success: boolean
    is_anomaly: boolean
    error: string
}

export const ThresholdCompute = (data: ComputeReq) => {
    return Axios.request<AxiosResponseData<ComputeResp>>({
        method: "POST",
        url: "/controller/task/compute",
        data: data,
    }).then(res => res.data);
};