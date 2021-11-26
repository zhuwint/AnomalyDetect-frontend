import React, {useEffect, useState} from "react";

import "./style/index.css";
import {Button, Card, Checkbox, Form, Input, message} from "antd";
import {GetUserInfo, StoreUserInfo} from "../../utils/useStorage";
import {UserInfo} from "../../redux/global";
import Title from "antd/es/typography/Title";
import {Axios} from "../../utils/request";
import {useDispatch, useSelector} from "react-redux";
import history from "../../history";
import {ReducerState} from "../../redux";


export default function LoginForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const [rememberPassword, setRememberPassword] = useState<boolean>(false);
    const [loginForm] = Form.useForm();

    const userInfo = useSelector((state: ReducerState) => state.global.userInfo);
    const dispatch = useDispatch();

    useEffect(() => {
        const oldUser = GetUserInfo();
        if (oldUser.username !== null && oldUser.password !== null) {
            loginForm.setFieldsValue({remember: true, username: oldUser.username, password: oldUser.password});
        } else {
            loginForm.setFieldsValue({remember: false, username: "", password: ""});
        }
    }, []);

    function login(remember: boolean, data: UserInfo): void {
        setLoading(true);
        Axios({
            method: "POST",
            url: "/controller/user/login",
            data: data,
        }).then(res => {
            if (res.status > 299 || res.status < 200) {
                message.error(res.data.msg, 2).then(r => null);
                return;
            }

            StoreUserInfo({
                username: data.username,
                password: data.password,
                login: true,
            });

            // 跳转
            window.location.href = history.createHref({pathname: "/"});
        }).catch((err) => {
            // TODO: redirect to 404 page
        });
        setLoading(false);
    }

    // 点击登录按钮后的回调事件
    const onFinish = () => {
        const data: UserInfo = {
            username: loginForm.getFieldValue("username"),
            password: loginForm.getFieldValue("password"),
        };
        login(loginForm.getFieldValue("remember"), data);
    };


    return (
        <div className="login-form-wrapper">
            <Card bordered={false} title={<Title level={2}>登录</Title>}>
                <Form form={loginForm}>
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: "请输入用户名"}]}>
                        <Input placeholder="用户名"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: "请输入密码"}]}>
                        <Input.Password placeholder="密码"/>
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}
                                onClick={() => onFinish()}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}