import React, {useEffect, useState} from "react";
import {useQuery} from "../../utils/useQuery";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {ReducerState} from "../../redux";
import {EnableOrDisableTask, FetchTask, SetThreshold, TaskStatus} from "../../services/service_task";
import {LeftOutlined} from "@ant-design/icons";
import {Button, Card, Descriptions, Divider, Input, message, Tag, Row, Col, InputNumber} from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import {parseDate} from "../../utils/timetransform";
import {TaskState} from "./components/taskstate";
import {DataPanel} from "./components/datapannel";
import {ModelPanel} from "./components/model";
import {ThresholdSetter} from "./components/threshold";
import {AlertRecordList} from "./components/record";
import {TimeRange, TimeRangeSelector} from "../../components/selector/timerange";


export const TaskView: React.FC = () => {
    const query = useQuery();
    const history = useHistory();
    const project = useSelector((state: ReducerState) => state.global.project);
    const [error, setError] = useState<string>("");
    const [task, setTask] = useState<TaskStatus>();
    const [range, setRange] = useState<TimeRange>({start: "", stop: ""});

    useEffect(() => {
        fetchTask();
    }, [window.location.pathname]);


    const fetchTask = () => {
        const taskId = query.get("taskId");
        if (taskId === null || taskId === "") {
            history.push("/task");
        }
        if (!project || project.id <= 0) {
            setError("请先选择项目");
        } else if (taskId) {
            FetchTask(taskId, project.id).then(res => {
                if (res.status === 0) {
                    setTask(res.data);
                } else {
                    setError(res.msg);
                }
            }).catch(res => {
                setError("获取失败");
            });
        }
    };

    const enableOrDisable = (isUpdate: boolean, enable: boolean) => {
        const taskId = query.get("taskId");
        if (taskId === null || taskId === "") {
            return;
        }
        if (project) {
            EnableOrDisableTask(taskId, project.id.toString(), isUpdate, enable).then(res => {
                if (res.status == 0) {
                    message.success("操作成功", 1);
                    fetchTask();
                } else {
                    message.error("操作失败: " + res.msg, 2);
                }
            }).catch(() => {
                message.error("操作失败", 2);
            });
        }
    };

    const updateThreshold = (lower: number | null, upper: number | null) => {
        if (task) {
            SetThreshold(task.info.task_id, task.info.project_id.toString(), lower, upper).then(res => {
                if (res.status === 0) {
                    message.success("操作成功", 1);
                } else {
                    message.error("操作失败", 2);
                }
                fetchTask();
            }).catch(() => {
                message.error("无法连接服务器");
            });
        }
    };

    return (
        <div>
            <Button type="link" icon={<LeftOutlined/>} onClick={() => history.goBack()}>返回</Button>
            {
                !task ? null : (
                    <>
                        <Card bordered={false} size="small">
                            <Descriptions size="small" bordered={true} column={4}>
                                <DescriptionsItem label="任务类型" span={4}>
                                    {task.info.is_stream ? <Tag color="#9FDB1D">流处理</Tag> :
                                        <Tag color="#3491FA">批处理</Tag>}
                                </DescriptionsItem>
                                <DescriptionsItem label="创建时间" span={8}>{parseDate(task.created)}</DescriptionsItem>
                                <DescriptionsItem label="修改时间" span={8}>{parseDate(task.updated)}</DescriptionsItem>
                                <DescriptionsItem label="阈值下限">
                                    <ThresholdSetter onConfirm={value => updateThreshold(value, null)}
                                                     defaultValue={parseFloat(task.threshold_lower.toFixed(3))}/>
                                </DescriptionsItem>
                                <DescriptionsItem label="阈值上限">
                                    <ThresholdSetter onConfirm={value => updateThreshold(null, value)}
                                                     defaultValue={parseFloat(task.threshold_upper.toFixed(3))}/>
                                </DescriptionsItem>
                                <DescriptionsItem label="当前值">{task.current_value.toFixed(3)}</DescriptionsItem>
                                <DescriptionsItem label="告警状态">
                                    <Tag
                                        color={!task.is_anomaly ? "#00B42A" : "#CB272D"}>{!task.is_anomaly ? "正常" : "异常"}</Tag>
                                </DescriptionsItem>
                            </Descriptions>
                            <Divider orientation="left">目标检测序列</Divider>
                            <DataPanel data={task.info.target}/>
                            <Divider orientation="left">数据预处理模型</Divider>
                            <ModelPanel model={task.info.preprocess}/>
                            <Divider orientation="left">检测模型</Divider>
                            <ModelPanel model={task.info.detect_model}/>
                            <Divider orientation="left">模型更新</Divider>
                            <TaskState state={task.model_update} isStream={false} info={task.info.model_update}
                                       dispatch={() => enableOrDisable(true, !task.model_update.enable)}/>
                            <Divider orientation="left">异常检测</Divider>
                            <TaskState state={task.anomaly_detect} isStream={task.info.is_stream}
                                       info={task.info.anomaly_detect}
                                       dispatch={() => enableOrDisable(false, !task.anomaly_detect.enable)}/>
                        </Card>
                        <Divider />
                        <Card bordered={false} size='small' title="告警日志"
                        extra={<TimeRangeSelector onChange={setRange} />}>
                            <AlertRecordList taskId={task.info.task_id} range={range} />
                        </Card>
                    </>
                )
            }
        </div>
    );
};