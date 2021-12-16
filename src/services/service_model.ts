import {Axios} from "../utils/request";
import {AxiosResponseData} from "./service_controller";


export interface ModelService {
    name: string;
    params: { [key: string]: string[] | string | number | boolean };
}


export type ModelMeta = {
    name: string
    url: string
    health: boolean
}


export const FetchModel = (type: "batch" | "stream" | "process") => {
    return Axios.request<AxiosResponseData<ModelMeta[]>>({
        method: "GET",
        url: "/controller/model/" + type,
    }).then(res => res.data);
};

export interface Model {
    params: { [key: string]: string[] | string | number | boolean };
    description: string;
    support_mlt: boolean;
}

export const FetchModelParams = (model: string) => {
    return Axios.request<AxiosResponseData<Model>>({
        method: "GET",
        url: "/controller/model/params",
        params: {
            model: model,
        },
    }).then(res => res.data);
};

export const ModelParamValidate = (model: string, params: { [key: string]: string | number | boolean }) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "POST",
        url: "/controller/model/validate",
        params: {
            model: model,
        },
        data: params,
    }).then(res => res.data);
};


export const RegisterModel = (name: string, url: string, type: "batch" | "stream" | "process") => {
    return Axios.request<AxiosResponseData<null>>({
        method: "POST",
        url: "/controller/model/register",
        data: {
            name: name,
            url: url,
            type: type === "stream" ? 0 : type === "batch" ? 1 : 2,
        },
    }).then(res => res.data);
};


export const UnregisterModel = (model: string) => {
    return Axios.request<AxiosResponseData<null>>({
        method: "DELETE",
        url: "/controller/model/register",
        params: {name: model},
    }).then(res => res.data);
};

