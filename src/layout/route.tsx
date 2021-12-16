import React from "react";
import {
    AppstoreAddOutlined,
    DashboardOutlined,
    FundOutlined,
    HomeOutlined,
    MessageOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import Home from "../pages/home";
import Sensor from "../pages/sensor";
import DashBoard from "../pages/dashboard";
import Task from "../pages/task";
import ModelService from "../pages/modelservice";
import SystemRecordPage from "../pages/record";

export const routeConfig = {
    path: "/",
    routes: [
        {
            path: "/home",
            name: "主页",
            icon: <HomeOutlined/>,
            component: Home,
        },
        {
            path: "/sensor",
            name: "传感器",
            icon: <UnorderedListOutlined/>,
            component: Sensor,
        },
        {
            path: "/dashboard",
            name: "仪表盘",
            icon: <DashboardOutlined/>,
            component: DashBoard,
        },
        {
            path: "/task",
            name: "任务",
            icon: <FundOutlined/>,
            component: Task,
        },
        {
            path: "/model",
            name: "模型注册中心",
            icon: <AppstoreAddOutlined/>,
            component: ModelService,
        },
        {
            path: "/record",
            name: "系统日志",
            icon: <MessageOutlined/>,
            component: SystemRecordPage,
        },
    ],
};

