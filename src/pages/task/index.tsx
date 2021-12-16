import React, {useEffect, useState} from "react";
import {DeleteTask, EnableOrDisableTask, FetchTaskList, SimpleStatus} from "../../services/service_task";
import {useSelector} from "react-redux";
import {ReducerState} from "../../redux";
import {Button, Divider, message, Space} from "antd";
import {NavLink, Route, Switch} from "react-router-dom";
import {CreateTask} from "./components/createtask";
import {TaskView} from "./view";
import Search from "antd/es/input/Search";
import {TaskList} from "../../components/task/tasklist";


const Task: React.FC = () => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const [taskList, setTaskList] = useState<SimpleStatus[]>([]);
    const [hidden, setHidden] = useState<boolean>(false);
    const [searchStr, setSearchStr] = useState<string>("");

    useEffect(() => {
        fetchData();
    }, [project]);


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
            FetchTaskList(project.id.toString()).then(res => {
                if (res.status === 0) {
                    setTaskList(res.data);
                } else {
                    message.error(res.msg, 2);
                }
            }).catch(() => {
                message.error("获取任务失败", 2);
            });
        }
    };

    const enableOrDisable = (taskId: string, isUpdate: boolean, enable: boolean) => {
        if (project) {
            EnableOrDisableTask(taskId, project.id.toString(), isUpdate, enable).then(res => {
                if (res.status == 0) {
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

    return (
        <div>
            {
                hidden ? null : <>
                    <Space align="center" size="small">
                        <Button type="primary">
                            <NavLink to="/task/create?type=stream">创建流处理任务</NavLink>
                        </Button>
                        <Button type="primary">
                            <NavLink to="/task/create?type=batch">创建批处理任务</NavLink>
                        </Button>
                        <Search placeholder="全文检索" onSearch={value => setSearchStr(value)} allowClear={true}
                                enterButton={true}/>
                    </Space>
                    <Divider/>
                    <TaskList dataSource={taskList} searchStr={searchStr} onDelete={deleteTask}
                              onEnable={enableOrDisable}/>
                </>
            }
            <Switch>
                <Route path="/task/create" component={CreateTask}/>
                <Route path="/task/view" component={TaskView}/>
            </Switch>
        </div>
    );
};


export default Task;