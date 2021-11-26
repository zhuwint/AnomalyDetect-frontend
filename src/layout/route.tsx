import React from "react";
import {DashboardOutlined, HomeOutlined, UnorderedListOutlined} from "@ant-design/icons";
import Home from "../pages/home";
import Sensor from "../pages/sensor";
import DashBoard from "../pages/dashboard";


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

        // {
        //     path: "/admin",
        //     name: "管理页",
        //     icon: <CrownOutlined/>,
        //     access: "canAdmin",
        //     component: "./Admin",
        //     routes: [
        //         {
        //             path: "/admin/sub-page1",
        //             name: "一级页面",
        //             icon: <CrownOutlined/>,
        //             component: "./Welcome",
        //         },
        //         {
        //             path: "/admin/sub-page2",
        //             name: "二级页面",
        //             icon: <CrownOutlined/>,
        //             component: "./Welcome",
        //         },
        //         {
        //             path: "/admin/sub-page3",
        //             name: "三级页面",
        //             icon: <CrownOutlined/>,
        //             component: "./Welcome",
        //         },
        //     ],
        // },
    ],
};

