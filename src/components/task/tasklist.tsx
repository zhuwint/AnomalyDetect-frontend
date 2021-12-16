import React, {useState} from "react";
import {Button, Popconfirm, Table, Tag, Tooltip} from "antd";
import {SimpleStatus} from "../../services/service_task";
import {NavLink} from "react-router-dom";
import {QuestionCircleOutlined} from "@ant-design/icons";
import "./styles/index.css";

interface IProps {
    onDelete?: (id: string) => void;
    dataSource: SimpleStatus[];
    onEnable?: (id: string, isUpdate: boolean, enable: boolean) => void;
    searchStr?: string;
    onSelect?: (record: SimpleStatus | null) => void;
}

export const TaskList: React.FC<IProps> = (props) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selected, setSelected] = useState<string>("");

    const enableOrDisable = (taskId: string, isUpdate: boolean, enable: boolean) => {
        if (props.onEnable) {
            props.onEnable(taskId, isUpdate, enable);
        }
    };

    const deleteTask = (taskId: string) => {
        if (props.onDelete) {
            props.onDelete(taskId);
        }
    };

    const columns = [
        {
            title: "任务类型",
            dataIndex: "is_stream",
            key: "is_stream",
            render: (text: string, record: SimpleStatus) => (
                record.is_stream ? <Tag color="#9FDB1D">流处理</Tag> : <Tag color="#3491FA">批处理</Tag>
            ),
            filters: [
                {
                    "text": "流处理",
                    "value": true,
                },
                {
                    "text": "批处理",
                    "value": false,
                },
            ],
            onFilter: (value: string | number | boolean, record: SimpleStatus) => record.is_stream === value,
        },
        {
            title: "模型",
            dataIndex: "model",
            key: "model",
            sorter: {
                compare: (a: SimpleStatus, b: SimpleStatus) => a.model.localeCompare(b.model),
            },
        },
        {
            title: "传感器地址",
            dataIndex: "sensor_mac",
            key: "sensor_mac",
            sorter: {
                compare: (a: SimpleStatus, b: SimpleStatus) => a.sensor_mac.localeCompare(b.sensor_mac),
            },
        },
        {
            title: "采集类型",
            dataIndex: "sensor_type",
            key: "sensor_type",
        },
        {
            title: "阈值下限",
            dataIndex: "threshold_lower",
            key: "threshold_lower",
            render: (text: string, row: SimpleStatus) => (
                row.threshold_lower.toFixed(3)
            ),
        },
        {
            title: "阈值上限",
            dataIndex: "threshold_upper",
            key: "threshold_upper",
            render: (text: string, row: SimpleStatus) => (
                row.threshold_upper.toFixed(3)
            ),
        },
        {
            title: "当前值",
            dataIndex: "current_value",
            key: "current_value",
            render: (text: string, row: SimpleStatus) => (
                row.current_value.toFixed(3)
            ),
        },
        {
            title: "阈值更新",
            dataIndex: "update_enable",
            key: "update_enable",
            render: (text: string, row: SimpleStatus) => (
                <Tooltip title={row.update_enable ? "点击暂停" : "点击运行"}>
                    <Tag color={row.update_enable ? "#4080FF" : "#A9AEB8"} style={{width: "50px", textAlign: "center"}}>
                        <a onClick={() => enableOrDisable(row.task_id, true, !row.update_enable)}>
                            {row.update_enable ? "运行中" : "暂停中"}
                        </a>
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: "异常检测",
            dataIndex: "detect_enable",
            key: "detect_enable",
            render: (text: string, row: SimpleStatus) => (
                <Tooltip title={row.detect_enable ? "点击暂停" : "点击运行"}>
                    <Tag color={row.detect_enable ? "#4080FF" : "#A9AEB8"} style={{width: "50px", textAlign: "center"}}>
                        <a onClick={() => enableOrDisable(row.task_id, false, !row.detect_enable)}>
                            {row.detect_enable ? "运行中" : "暂停中"}
                        </a>
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: "告警状态",
            dataIndex: "is_anomaly",
            key: "is_anomaly",
            render: (test: string, row: SimpleStatus) => (
                <Tag color={!row.is_anomaly ? "#00B42A" : "#CB272D"}>{!row.is_anomaly ? "正常" : "异常"}</Tag>
            ),
            filters: [
                {
                    "text": "正常",
                    "value": false,
                },
                {
                    "text": "异常",
                    "value": true,
                },
            ],
            onFilter: (text: string | number | boolean, record: SimpleStatus) => record.is_anomaly === text,
        },
        {
            title: "操作",
            key: "action",
            render: (text: string, record: SimpleStatus) => (
                <>
                    <Button type="link" size="small">
                        <NavLink
                            to={"/task/view?taskId=" + record.task_id}>查看</NavLink>
                    </Button>
                    <Popconfirm title="确定要删除该任务吗?" icon={<QuestionCircleOutlined style={{color: "red"}}/>}
                                placement="topLeft" onConfirm={() => deleteTask(record.task_id)}>
                        <Button type="link" size="small">删除</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    let display: SimpleStatus[] = [];
    props.dataSource.forEach((item, index) => {
        let show: boolean = false;
        if (props.searchStr && props.searchStr !== "") {
            // TODO: 目前是对所有字段进行搜索，但实际上table显示的并不是所有字段
            Object.values(item).forEach(value => {
                if (value.toString().indexOf(props.searchStr) !== -1) {
                    show = true;
                    return;
                }
            });
        }
        if (show || props.searchStr === undefined || props.searchStr === "") {
            display.push(Object.assign({}, item, {"key": index.toString()}));
        }
    });

    return (
        <Table columns={columns} dataSource={display} size="small" scroll={{x: "max-content"}}
               pagination={{
                   position: ["bottomCenter"],
                   pageSize: 12,
                   showSizeChanger: false,
                   current: currentPage,
                   onChange: (page) => setCurrentPage(page),
                   showQuickJumper: true,
                   hideOnSinglePage: true,
               }}
               onRow={
                   (record: SimpleStatus) => {
                       return {
                           onClick: event => {
                               if (props.onSelect) {
                                   props.onSelect(record);
                               }
                               setSelected(record.task_id);
                           }, // 点击行
                           onDoubleClick: event => {
                           },
                           onContextMenu: event => {
                           },
                           onMouseEnter: event => {

                           }, // 鼠标移入行
                           onMouseLeave: event => {
                           },
                       };
                   }
               }
               onHeaderRow={
                   (columns, index) => {
                       return {
                           onClick: () => {
                               setSelected("");
                               if (props.onSelect) {
                                   props.onSelect(null);
                               }
                           }, // 点击表头行
                       };
                   }
               }
               rowClassName={
                   (record: SimpleStatus, index: number) => record.task_id === selected ? "my-row-select" : "my-row-not-select"
               }
        />
    );
};