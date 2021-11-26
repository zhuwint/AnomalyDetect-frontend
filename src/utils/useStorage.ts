import cookie from "react-cookies";

import {UserInfo, ProjectInfo} from "../redux/global";


const userCookie: string = "userInfo";          // 存储user信息的cookie名
const projectCookie: string = "projectInfo";    // 存储project信息的cookie名

// 在浏览器中存储用户信息
export function StoreUserInfo(info: UserInfo): void {
    let sevenDays = new Date(new Date().getTime() + 168 * 3600 * 1000);
    cookie.save(userCookie, info, {expires: sevenDays});
}

// 从浏览器存储获取用户信息，如果不存在则返回null
export function GetUserInfo(): UserInfo {
    let data = cookie.load(userCookie);
    if (data === undefined || data == null) {
        return {
            username: "",
            password: "",
        } as UserInfo;
    }
    return {
        username: data.username || "",
        password: data.password || "",
        login: data.login || false,
        org: data.org || "",
        token: data.token || "",
    } as UserInfo;
}


export function UserLogout(): void {
    let data = cookie.load(userCookie);
    if (data === undefined) {
        return;
    }
    const info = {
        username: data.username,
        password: data.password,
        login: false,
    };
    let sevenDays = new Date(new Date().getTime() + 168 * 3600 * 1000);
    cookie.save("userInfo", info, {expires: sevenDays});
}

// 删除浏览器保存的用户状态
export function DelUserInfo(): void {
    cookie.remove(userCookie);
}


// 保存project信息
export function StoreProjectInfo(info: ProjectInfo): void {
    let sevenDays = new Date(new Date().getTime() + 168 * 3600 * 1000);
    cookie.save(projectCookie, info, {expires: sevenDays});
}

// 读取project信息
export function GetProjectInfo(): ProjectInfo {
    let data = cookie.load(projectCookie);
    if (data === undefined || data === null) {
        return {
            id: -1,
            name: "",
        } as ProjectInfo;
    }
    return {
        id: data.id,
        name: data.name,
    } as ProjectInfo;
}