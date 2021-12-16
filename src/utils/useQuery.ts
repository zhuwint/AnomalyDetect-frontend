import {useLocation} from "react-router-dom";


// 获取 url 参数
export function useQuery() {
    return new URLSearchParams(useLocation().search);
}
