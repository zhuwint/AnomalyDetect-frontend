import React, {useEffect, useState} from "react";
import {LeftOutlined} from "@ant-design/icons";
import {Button, Card, Col, Descriptions, Input, message, Row, Tag} from "antd";
import {useHistory} from "react-router-dom";
import {useQuery} from "../../../utils/useQuery";
import {useSelector} from "react-redux";
import {ReducerState} from "../../../redux";
import {
    EnableOrDisableTask,
    GetUnionTask,
    SetUnionThreshold,
    UnionMeta,
    UnionTaskStatus,
} from "../../../services/service_task";
import DescriptionsItem from "antd/es/descriptions/Item";
import {parseDate} from "../../../utils/timetransform";
import {ThresholdSetter} from "./setter";
import Text from "antd/es/typography/Text";
import {UnionRecordList} from "./record";

export const ViewTask: React.FC = () => {
    const history = useHistory();
    const query = useQuery();
    const project = useSelector((state: ReducerState) => state.global.project);
    const [task, setTask] = useState<UnionTaskStatus>();
    const [error, setError] = useState<string>("");

    useEffect(() => {
        setError("");
        fetchData();
    }, [window.location.pathname]);


    const fetchData = () => {
        setError("");
        const taskId = query.get("taskId");
        if (taskId === null || taskId === "") {
            history.push("/union");
        }
        if (!project || project.id <= 0) {
            setError("请先选择项目");
        } else if (taskId) {
            GetUnionTask(taskId, project.id.toString()).then(res => {
                if (res.status === 0) {
                    setTask(res.data);
                } else {
                    setError(res.msg);
                }
            }).catch(() => {
                setError("无法连接服务器");
            });
        }
    };

    const enable = () => {
        setError("");
        if (project && task) {
            EnableOrDisableTask(task.info.task_id, project.id.toString(), false, !task.enable).then(res => {
                if (res.status === 0) {
                    message.success("操作成功", 1);
                } else {
                    message.error("操作失败", 2);
                    setError(res.msg);
                }
                fetchData();
            }).catch(() => {
                message.error("操作失败", 2);
                setError("无法连接服务器");
            });
        } else {
            setError("无效项目与任务");
        }
    };


    const change = (index: number, lower: number, upper: number) => {
        if (task && project) {
            let newSeries: UnionMeta[] = [];
            for (let i = 0; i < task.info.series.length; i++) {
                if (i === index) {
                    let temp = task.info.series[i];
                    setError("");
                    SetUnionThreshold(task.info.task_id, project.id.toString(), temp.sensor_mac,
                        temp.sensor_type, temp.receive_no, lower, upper).then(res => {
                        if (res.status === 0) {
                            message.success("操作成功", 1);
                        } else {
                            message.error("操作失败", 2);
                            setError(res.msg);
                        }
                        fetchData();
                    }).catch(() => {
                        message.error("操作失败");
                        setError("无法连接服务器");
                    });
                }
            }
        }
    };

    return (
        <div>
            <Button type="link" icon={<LeftOutlined/>} onClick={() => history.goBack()}>
                返回
            </Button>
            {
                !task ? null : (
                    <>
                        <Card bordered={false} size="small">
                            <Descriptions size="small" bordered={true} column={4}>
                                <DescriptionsItem label="任务名称">
                                    {task.info.task_name}
                                </DescriptionsItem>
                                <DescriptionsItem label="任务类型">
                                    联合告警任务
                                </DescriptionsItem>
                                <DescriptionsItem label="创建时间">{parseDate(task.created)}</DescriptionsItem>
                                <DescriptionsItem label="修改时间">{parseDate(task.updated)}</DescriptionsItem>
                                <DescriptionsItem label="运行状态">
                                    <Tag color={task.enable ? "#4080FF" : "#A9AEB8"}
                                         style={{width: "120px", textAlign: "center"}}>
                                        <a onClick={enable}>
                                            {task.enable ? "运行中(点击暂停)" : "暂停中(点击运行)"}
                                        </a>
                                    </Tag>
                                </DescriptionsItem>
                                <DescriptionsItem label="告警状态">
                                    <Tag
                                        color={!task.is_anomaly ? "#00B42A" : "#CB272D"}>{!task.is_anomaly ? "正常" : "异常"}</Tag>
                                </DescriptionsItem>
                            </Descriptions>
                            <br/>
                            <Card title="测量点" size="small" bordered={true}>
                                {
                                    task.info.series.map((item, index) => {
                                        let k: string = item.sensor_mac + "#" + item.sensor_type + "#" + item.receive_no;
                                        return <Row gutter={8} style={{padding: "4px 0"}}>
                                            <Col
                                                span={1}>{index === 0 ? null : (task.info.operate[index - 1] === 0 ? "且" : "或")}
                                            </Col>
                                            <Col span={1}>{index + 1}</Col>
                                            <Col span={4}>
                                                <Input size="small" value={item.sensor_mac + "-" + item.sensor_type}
                                                       disabled={true}/>
                                            </Col>
                                            <Col span={3}>当前值: {task.state.hasOwnProperty(k) ?
                                                <Text
                                                    style={{color: (task.state[k].value > item.threshold_upper || task.state[k].value < item.threshold_lower) ? "red" : "green"}}>{task.state[k].value.toFixed(3)}</Text> :
                                                <Text style={{color: "gray"}}>暂无数据</Text>}
                                            </Col>
                                            <Col
                                                span={3}>接收个数: {task.state.hasOwnProperty(k) ? task.state[k].triggered :
                                                <Text style={{color: "gray"}}>暂无数据</Text>}
                                            </Col>
                                            <Col span={12}>
                                                <ThresholdSetter index={index} defaultLower={item.threshold_lower}
                                                                 defaultUpper={item.threshold_upper} dispatch={change}/>
                                            </Col>
                                        </Row>;
                                    })
                                }
                                <br/>
                                注："且"表示2个测量点都必须满足阈值区间，有一者不满足则产生告警
                                <br/>
                                "或"表示若有2个测量点之一满足阈值区间或都满足阈值区间则不告警，否则产生告警
                            </Card>
                        </Card>
                        {
                            error === "" ? null : <Text style={{color: "red"}}>{error}</Text>
                        }
                        <UnionRecordList taskId={task.info.task_id}/>
                    </>
                )
            }
        </div>
    );
};