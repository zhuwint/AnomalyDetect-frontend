import React, {useEffect, useState} from "react";
import {Measurement} from "../../../services/service_controller";
import {TimeRange} from "../../../components/selector/timerange";
import {RegionMark} from "../../../components/graph/line";
import {useSelector} from "react-redux";
import {ReducerState} from "../../../redux";
import {Button, message, Row, Space} from "antd";
import {NavLink} from "react-router-dom";
import {DeleteTask, EnableOrDisableTask, FetchTaskWithTarget, SimpleStatus} from "../../../services/service_task";
import {TaskList} from "../../../components/task/tasklist";
import {TimeSeriesDataBoard} from "../../../components/board/board";
import {AlertRecordList} from "../../task/components/record";
import Text from "antd/es/typography/Text";
import {AlertRecord} from "../../../services/service_record";

interface IProps {
    sensorMac: string;
    measurement: Measurement;
    timeRange: TimeRange;
    interval: string;
    enableCreate?: boolean;
    height?: number;
}


export const DataBoard: React.FC<IProps> = (props) => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const [error, setError] = useState<string>("");
    const [taskList, setTaskList] = useState<SimpleStatus[]>([]);
    const [selectedTask, setSelectedTask] = useState<SimpleStatus | null>(null);
    const [region, setRegion] = useState<RegionMark[]>([]);                // 图像区域mark

    useEffect(() => {
        fetchTaskList();
    }, [props]);


    const fetchTaskList = () => {
        if (!project) {
            return;
        }
        const {sensorMac, measurement} = props;
        FetchTaskWithTarget(project.id, sensorMac, measurement.gather_type, measurement.receive_no.toString()).then(
            res => {
                if (res.status === 0) {
                    setTaskList(res.data);
                } else {
                    setTaskList([]);
                    setError(res.msg);
                }
            },
        ).catch(err => setError(err.toString()));
    };

    // 设置区域标注
    const createRegionMark = (data: AlertRecord[]) => {
        let r: RegionMark[] = [];
        data.reverse().forEach((item, index) => {
            if (r.length !== 0) {
                r.push({
                    start: item.start,
                    end: r[r.length - 1].start,
                    alert: item.alert,
                });
            } else {
                r.push({
                    start: item.start,
                    end: item.stop,
                    alert: item.alert,
                });
            }
        });
        setRegion(r.reverse());
    };

    const deleteTask = (id: string) => {
        if (project) {
            DeleteTask(id, project.id.toString()).then(res => {
                if (res.status === 0) {
                    message.success("操作成功", 1);
                } else {
                    message.error("操作失败: " + res.msg, 2);
                }
                fetchTaskList();
            }).catch(() => {
                message.error("无法连接服务器", 2);
            });
        }
    };

    const enableTask = (id: string, isUpdate: boolean, enable: boolean) => {
        if (project) {
            EnableOrDisableTask(id, project.id.toString(), isUpdate, enable).then(res => {
                if (res.status === 0) {
                    message.success("操作成功", 1);
                } else {
                    message.error("操作失败: " + res.msg, 2);
                }
                fetchTaskList();
            }).catch(() => {
                message.error("无法连接服务器", 2);
            });
        }
    };

    const createStream = `/task/create?type=stream&sensor_mac=${props.sensorMac}&sensor_type=${props.measurement.gather_type}&receive_no=${props.measurement.receive_no}`;
    const createBatch = `/task/create?type=batch&sensor_mac=${props.sensorMac}&sensor_type=${props.measurement.gather_type}&receive_no=${props.measurement.receive_no}`;

    return (
        <React.Fragment>
            <Text>注:背景区域绿色代表正常，红色代表异常，黄色代表未检测</Text>
            <br/>
            <TimeSeriesDataBoard interval={props.interval} height={props.height} timeRange={props.timeRange}
                                 measurement={props.measurement} sensorMac={props.sensorMac} region={region}
            />
            <br/>
            <Row justify="end">
                <Space align="center">
                    <Button type="primary">
                        <NavLink to={createStream}>创建流处理任务</NavLink>
                    </Button>
                    <Button type="primary">
                        <NavLink to={createBatch}>创建批处理任务</NavLink>
                    </Button>
                </Space>
            </Row>
            <br/>
            <TaskList dataSource={taskList} onDelete={deleteTask} onEnable={enableTask} onSelect={setSelectedTask}/>
            <br/>
            {
                selectedTask === null ? null : <AlertRecordList taskId={selectedTask.task_id} range={props.timeRange}
                                                                setRecord={createRegionMark}/>
            }
        </React.Fragment>
    );
};