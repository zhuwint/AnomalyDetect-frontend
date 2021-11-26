export interface UserInfo {
    username: string;   // 用户名
    password: string;   // 密码
    login?: boolean;    // 是否处于登录状态
    org?: string;       // 所属组织
    token?: string;     // token
}

export interface ProjectInfo {
    id: number;         // 项目id
    name: string;       // 项目名称
}

export interface GlobalState {
    userInfo?: UserInfo;
    project?: ProjectInfo;
}

// 初始化全局状态
const initState: GlobalState = {
    userInfo: {
        username: "",
        password: "",
        login: false,
        org: "",
        token: "",
    },
    project: {
        id: -1,
        name: "",
    },
};

// action类型，与GlobalState一一对应
interface Action {
    type: string;
    payload: {
        userInfo?: UserInfo;
        project?: ProjectInfo;
    };
}

export default function GlobalReducer(state = initState, action: Action) {
    switch (action.type) {
        case "update-userInfo": {
            const {userInfo} = action.payload;
            return {
                ...state,
                userInfo,
            };
        }
        case "update-project": {
            const {project} = action.payload;
            return {
                ...state,
                project,
            };
        }
        default:
            return state;
    }
}