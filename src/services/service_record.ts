import {Axios} from "../utils/request";
import {AxiosResponseData} from "./service_controller";


export type SystemRecord = {
    time: string
    task_id: string
    project_id: string
    sensor_mac: string
    sensor_type: string
    receive_no: string
    threshold_lower: number
    threshold_upper: number
    level: string
    description: string
}


export type AlertRecord = {
    time: string
    start: string
    stop: string
    task_id: string
    project_id: string
    sensor_mac: string
    sensor_type: string
    receive_no: string
    threshold_lower: number
    threshold_upper: number
    value: number
    alert: boolean
}


export const FetchAlertRecords = (projectId: number, taskId: string, start: string | null, end: string | null) => {
    let params: any = {
        projectId: projectId,
        taskId: taskId,
        start: start !== null ? start : "",
        end: end !== null ? end : "",
    };

    return Axios.request<AxiosResponseData<AlertRecord[]>>({
        method: "GET",
        url: "/controller/record/alert",
        params: params,
    }).then(res => res.data);
};


export const FetchSystemRecords = (projectId: number, taskId: string | null, start: string | null, end: string | null) => {
    let params: any = {
        projectId: projectId,
        taskId: taskId !== null ? taskId : "",
        start: start !== null ? start : "",
        end: end !== null ? end : "",
    };

    return Axios.request<AxiosResponseData<SystemRecord[]>>({
        method: "GET",
        url: "/controller/record/system",
        params: params,
    }).then(res => res.data);
};


// export const SetRecordView = (id: number) => {
//     return Axios.request<AxiosResponseData<null>>({
//         method: "POST",
//         url: "/controller/record",
//         params: {id: id},
//     }).then(res => res.data);
// };
//
// export const AcceptAllRecord = (projectId: number, taskId: string | null, start: string | null, end: string | null) => {
//     let params: any = {
//         projectId: projectId,
//     };
//     if (taskId !== null) {
//         params["taskId"] = taskId;
//     }
//     if (start !== null) {
//         params["start"] = start;
//     }
//     if (end !== null) {
//         params["end"] = end;
//     }
//     return Axios.request<AxiosResponseData<null>>({
//         method: "POST",
//         url: "/controller/record/accept",
//         params: params,
//     }).then(res => res.data);
// };