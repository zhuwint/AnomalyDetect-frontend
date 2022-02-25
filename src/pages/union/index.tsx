import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {ReducerState} from "../../redux";
import {DeleteTask, EnableOrDisableTask, FetchUnionTaskList, SimpleUnionStatus} from "../../services/service_task";
import {Button, Divider, message, Space} from "antd";
import {UnionList} from "../../components/task/unionlist";
import Search from "antd/es/input/Search";
import {Route, Switch, NavLink} from "react-router-dom";
import {ViewTask} from "./components/view";
import {CreateTask} from "./components/create";


const UnionTask: React.FC = () => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const [taskList, setTaskList] = useState<SimpleUnionStatus[]>([]);
    const [hidden, setHidden] = useState<boolean>(false);
    const [searchStr, setSearchStr] = useState<string>("");

    useEffect(()=>{
        fetchData()
    }, [project])

    useEffect(() => {
        let endpoint: string[] = window.location.pathname.split("/");
        if (endpoint.length > 2) {
            setHidden(true);
        } else {
            setHidden(false);
            fetchData();
        }
    }, [window.location.pathname]);

    const fetchData = () => {
        if (project) {
            FetchUnionTaskList(project.id.toString()).then(res => {
                if (res.status === 0) {
                    setTaskList(res.data);
                } else {
                    message.error("获取数据失败");
                }
            }).catch(() => message.error("获取数据失败", 2));
        }
    };


    const deleteTask = (taskId: string) => {
        if (project) {
            DeleteTask(taskId, project.id.toString()).then(res => {
                if (res.status === 0) {
                    message.success("操作成功", 1);
                    fetchData();
                } else {
                    message.error("操作失败: " + res.msg, 2);
                }
            }).catch(() => {
                message.error("操作失败", 2);
            });
        }
    };

    const enableOrDisable = (taskId: string, isUpdate: boolean, enable: boolean) => {
        if (project) {
            EnableOrDisableTask(taskId, project.id.toString(), isUpdate, enable).then(res => {
                if (res.status === 0) {
                    message.success("操作成功", 1);
                    fetchData();
                } else {
                    message.error("操作失败: " + res.msg, 2);
                }
            }).catch(() => {
                message.error("操作失败", 2);
            });
        }
    };

    return (
        <div>
            {
                hidden ? null : <>
                    <Space align="center" size="small">
                        <Button type="primary">
                            <NavLink to="/union/create">创建</NavLink>
                        </Button>
                        <Search placeholder="全文检索" onSearch={value => setSearchStr(value)} allowClear={true}
                                enterButton={true}/>
                    </Space>
                    <Divider/>
                    <UnionList dataSource={taskList} searchStr={searchStr} onDelete={deleteTask}
                               onEnable={enableOrDisable}/>
                </>
            }
            <Switch>
                <Route path="/union/view" component={ViewTask}/>
                <Route path="/union/create" component={CreateTask}/>
            </Switch>
        </div>
    );
};

export default UnionTask;