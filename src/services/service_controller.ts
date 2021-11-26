import {Axios} from "../utils/request";


interface AxiosResponseData<T> {
    status: number,
    msg: string,
    data: T
}

// -----------------------------------------------------------------------------------------------

export interface ProjectIdName {
    // eslint-disable-next-line camelcase
    project_id: number;
    // eslint-disable-next-line camelcase
    project_name: string;
}

// 获取项目列表
export const FetchProjects = () => {
    return new Promise((resolve: (value: AxiosResponseData<ProjectIdName[]>) => void, reject) => {
        Axios.request<AxiosResponseData<ProjectIdName[]>>({
            method: "GET",
            url: "/controller/manage/projects",
        }).then((res) => resolve(res.data)).catch(err => reject(err));
    });
};


// -----------------------------------------------------------------------------------------------

export interface SensorQuery {
    project_id: string,
    location1?: string,
    location2?: string,
    location3?: string,
    location4?: string,
}

export interface SensorInfo {
    sensor_mac: string,
    type_id: string,
    type_name: string,
    location1: string,
    location2: string,
    location3: string,
    location4: string
}

// 获取传感器列表
export const FetchSensors = (data: SensorQuery) => {
    return new Promise((resolve: (value: AxiosResponseData<SensorInfo[]>) => void, reject) => {
        Axios.request<AxiosResponseData<SensorInfo[]>>({
            method: "POST",
            url: "/controller/manage/sensors",
            data: data,
        }).then(res => resolve(res.data)).catch(err => reject(err));
    });
};


// -----------------------------------------------------------------------------------------------

export interface Location {
    level: number,
    location_1_id: number,
    location_2_id: number,
    location_3_id: number,
    location_4_id: number,
    location_name: string,
    children: Location[] | null
}

// 获取位置信息
export const FetchLocations = (projectId: number) => {
    return new Promise((resolve: (value: AxiosResponseData<Location[]>) => void, reject) => {
        Axios.request<AxiosResponseData<Location[]>>({
            method: "GET",
            url: "/controller/manage/locations",
            params: {project_id: projectId},
        }).then(res => resolve(res.data)).catch(err => reject(err));
    });
};


// -----------------------------------------------------------------------------------------------
export interface Measurement {
    receive_no: number,
    gather_type: string,
    gather_type_name: string,
    unit: string
}

export const FetchMeasurements = (typeId: number) => {
    return new Promise((resolve: (value: AxiosResponseData<Measurement[]>) => void, reject) => {
        Axios.request<AxiosResponseData<Measurement[]>>({
            method: "GET",
            url: "/controller/manage/measurements",
            params: {type_id: typeId},
        }).then(res => resolve(res.data)).catch(err => reject(err));
    });
};


// -----------------------------------------------------------------------------------------------

export interface Filter {
    sensor_mac: string;
    sensor_type: string;
    receive_no: string;
}

export interface DataQuery {
    project_id: number;
    start: string;
    stop: string;
    interval: string;
    filter: Filter;
    group_by?: object;
}

export interface Point {
    time: string;
    value: (number | null)[];
}

export interface TimeSeries {
    name: string;
    column: string[];
    rows: Point[];
}


export interface InfluxTable {
    table: TimeSeries[];
}

export const FetchTimeSeries = (data: DataQuery) => {
    return new Promise((resolve: (value: AxiosResponseData<InfluxTable>) => void, reject) => {
        Axios.request<AxiosResponseData<InfluxTable>>({
            method: "POST",
            url: "/controller/data/query",
            data: data,
        }).then(res => resolve(res.data)).catch(err => reject(err));
    });
};