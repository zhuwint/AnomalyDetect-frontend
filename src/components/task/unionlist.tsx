import React, {useState} from "react";
import {SimpleUnionStatus} from "../../services/service_task";
import {Button, Popconfirm, Table, Tag, Tooltip} from "antd";
import {NavLink} from "react-router-dom";
import {QuestionCircleOutlined} from "@ant-design/icons";

interface IProps {
    onDelete?: (id: string) => void;
    dataSource: SimpleUnionStatus[];
    onEnable?: (id: string, isUpdate: boolean, enable: boolean) => void;
    searchStr?: string;
    onSelect?: (record: SimpleUnionStatus | null) => void;
}

export const UnionList: React.FC<IProps> = (props) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const enableOrDisable = (taskId: string, enable: boolean) => {
        if (props.onEnable) {
            props.onEnable(taskId, false, enable);
        }
    };

    const deleteTask = (taskId: string) => {
        if (props.onDelete) {
            props.onDelete(taskId);
        }
    };

    const columns = [
        {
            title: "任务名",
            dataIndex: "task_name",
            key: "task_name",
        },
        {
            title: "运行状态",
            dataIndex: "enable",
            key: "enable",
            render: (text: string, row: SimpleUnionStatus) => (
                <Tooltip title={row.enable ? "点击暂停" : "点击运行"}>
                    <Tag color={row.enable ? "#4080FF" : "#A9AEB8"} style={{width: "50px", textAlign: "center"}}>
                        <a onClick={() => enableOrDisable(row.task_id, !row.enable)}>
                            {row.enable ? "运行中" : "暂停中"}
                        </a>
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: "告警状态",
            dataIndex: "is_anomaly",
            key: "anomaly",
            render: (test: string, row: SimpleUnionStatus) => (
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
            onFilter: (text: string | number | boolean, record: SimpleUnionStatus) => record.is_anomaly === text,
        },
        {
            title: "操作",
            key: "action",
            render: (text: string, record: SimpleUnionStatus) => (
                <>
                    <Button type="link" size="small">
                        <NavLink
                            to={"/union/view?taskId=" + record.task_id}>查看</NavLink>
                    </Button>
                    <Popconfirm title="确定要删除该任务吗?" icon={<QuestionCircleOutlined style={{color: "red"}}/>}
                                placement="topLeft" onConfirm={() => deleteTask(record.task_id)}>
                        <Button type="link" size="small">删除</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <Table columns={columns} dataSource={props.dataSource} size="small" scroll={{x: "max-content"}}
               pagination={{
                   position: ["bottomCenter"],
                   pageSize: 12,
                   showSizeChanger: false,
                   current: currentPage,
                   onChange: (page) => setCurrentPage(page),
                   showQuickJumper: true,
                   hideOnSinglePage: true,
               }}
        />
    );
};