import React, {useEffect, useState} from "react";
import type {ProSettings} from "@ant-design/pro-layout";
import ProLayout, {PageContainer} from "@ant-design/pro-layout";
import {routeConfig} from "./route";
import {LayoutHeader} from "./components/header";
import {LayoutFooter} from "./components/footer";
import {GithubOutlined} from "@ant-design/icons";
import {NavLink, Route} from "react-router-dom";
import ErrorBoundary from "../pages/error";


const customSettings: Partial<ProSettings> = {
    "fixSiderbar": true,
    "fixedHeader": true,
    "navTheme": "dark",
    "primaryColor": "#1890ff",
    "layout": "side",
    "contentWidth": "Fluid",
    "splitMenus": false,
};


export default () => {
    const [pathname, setPathname] = useState<string>("/home");


    useEffect(() => {
        console.log("set pathname");
        let endpoint: string[] = window.location.pathname.split("/");
        if (endpoint.length > 1) {
            setPathname("/" + endpoint[1]);
        }
    }, [window.location.pathname]);


    return (
        <div
            id="test-pro-layout"
            style={{
                height: "100vh",
            }}
        >
            <ProLayout
                menuItemRender={(item, dom) => (
                    <NavLink to={item.path || "/"} onClick={() => setPathname(item.path || "/")}>{dom}</NavLink>
                )}
                subMenuItemRender={(item, dom) => (
                    <NavLink to={item.path || "/"} onClick={() => setPathname(item.path || "/")}>{dom}</NavLink>
                )
                }
                logo={null}
                title={"时间序列分析系统"}
                menuHeaderRender={(logo, title) => (
                    <div id="customize_menu_header">
                        {logo}
                        {title}
                    </div>
                )}
                route={routeConfig}
                rightContentRender={() => (<LayoutHeader/>)}
                footerRender={() => (<LayoutFooter/>)}
                {...customSettings}
                location={{pathname}}
            >
                <PageContainer>
                    <div style={{backgroundColor: "white", padding: "12px", width: "100%"}}>
                        <ErrorBoundary>
                            {
                                routeConfig.routes.map((item, index) => {
                                    return <Route key={index.toString()} path={item.path} component={item.component}/>;
                                })
                            }
                        </ErrorBoundary>
                    </div>
                </PageContainer>
            </ProLayout>
        </div>
    );
};