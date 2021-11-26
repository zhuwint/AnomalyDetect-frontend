import React, {Component} from "react";
import {Button, Result} from "antd";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface IProps {
    children: React.ReactNode;
}

interface IState {
    hasError: boolean;
}

class ErrorBoundary extends Component<IProps & RouteComponentProps, IState> {
    state: IState = {
        hasError: false,
    };

    static getDerivedStateFromError(error: any) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return {hasError: true};
    }

    componentDidCatch(error: any, errorInfo: any) {
        // 你同样可以将错误日志上报给服务器
        // logErrorToMyService(error, errorInfo);
        console.log(error, errorInfo);
    }

    backHome = () => {
        this.props.history.push("/");
    };

    render() {
        if (this.state.hasError) {
            // 你可以自定义降级后的 UI 并渲染
            return (
                <Result
                    status="500"
                    title="500"
                    subTitle="抱歉, 服务器发生了一些错误."
                    extra={<Button type="primary" onClick={this.backHome}>返回首页</Button>}
                />
            );
        }
        return this.props.children;
    }
}

export default withRouter(ErrorBoundary);