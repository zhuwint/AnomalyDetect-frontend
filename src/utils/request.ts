import axios from 'axios';
import { message } from 'antd';

export const Axios = axios.create({
    // baseURL: process.env.BASE_URL, // 设置请求的base url
    timeout: 20000, // 设置超时时长
})

// 设置post请求头
Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 请求前拦截
Axios.interceptors.request.use(config => {
    return config
}, err => {
    return Promise.reject(err)
})

// 返回后拦截
Axios.interceptors.response.use(res => {
    return res
}, err => {
    if (err.message === 'Network Error') {
        message.warning('网络连接异常！')
    }
    if (err.code === 'ECONNABORTED') {
        message.warning('请求超时，请重试')
    }
    return Promise.reject(err)
})