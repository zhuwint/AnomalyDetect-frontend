import {combineReducers} from "redux";
import global, {GlobalState} from "./global";


export interface ReducerState {
    global: GlobalState;
}

// store，全局唯一
export default combineReducers({
    global,
});

// react-redux
// 使用useSelector, useDispatch 代替 connector