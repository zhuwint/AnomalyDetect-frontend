import React, {useEffect} from "react";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import '@ant-design/pro-layout/dist/layout.css';
import 'antd/dist/antd.css';

import history from "./history";
import Login from "./pages/login";
import {Provider} from "react-redux";
import rootReducer from "./redux";
import {Axios} from "./utils/request";
import {message} from "antd";
import {GetUserInfo, StoreUserInfo} from "./utils/useStorage";
import {UserInfo} from "./redux/global";

import {createStore} from "redux";
import LayoutPage from "./layout";

// 全局store
const store = createStore(rootReducer);

function App() {
    const fetchUserInfo = () => {
        // 每一次刷新都会检查登录状态，如果登录失败，则跳转到登录界面
        const user = GetUserInfo();
        if (!user.login) {
            history.push("/login");
            return;
        }
        const data = {
            username: user.username,
            password: user.password,
        };
        Axios({
            method: "POST",
            url: "/controller/user/login",
            data: data,
        }).then(res => {
            if (res.status > 299 || res.status < 200) {
                message.error(res.data.msg, 2).then(r => null);
                return;
            }

            const info: UserInfo = {
                username: data.username,
                password: data.password,
                login: true,
                org: res.data.data.org,
                token: res.data.data.token,
            };

            // 存储用户信息，刷新后消失
            store.dispatch({
                type: "update-userInfo",
                payload: {
                    userInfo: info,
                },
            });
        }).catch((err) => {
            // 登录失败
            StoreUserInfo({
                username: data.username,
                password: data.password,
                login: false,
            });
        });
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <Router history={history}>
            <Provider store={store}>
                <Switch>
                    <Route exact path="/" render={() => < Redirect to="/home"/>}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/" component={LayoutPage}/>
                </Switch>
            </Provider>
        </Router>
    );
}

export default App;
