import React, {useEffect, useState} from "react";
import {AlertRecord, FetchSystemRecords, SystemRecord} from "../../../services/service_record";
import {useSelector} from "react-redux";
import {ReducerState} from "../../../redux";
import {Button, Table, Tag, Tooltip} from "antd";
import Text from "antd/es/typography/Text";
import {parseDate} from "../../../utils/timetransform";

interface IProps {
    taskId: string | null;
    view: boolean | null;
    start?: string;
    end?: string;
}


const level = {
    "0": "Info",
    "1": "Warn",
    "2": "Alert",
    "3": "Crit",
};


export const RecordList: React.FC<IProps> = (props) => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const [error, setError] = useState<string>("");
    const [records, setRecords] = useState<SystemRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);


    useEffect(() => {
        fetchData();
    }, [props, project]);


    const fetchData = () => {
        if (project) {
            setLoading(true);
            FetchSystemRecords(project.id, props.taskId, props.start ? props.start : null, props.end ? props.end : null).then(res => {
                if (res.status === 0) {
                    setRecords(res.data);
                } else {
                    setError(res.msg);
                }
                setLoading(false);
            }).catch(() => {
                setError("获取失败");
                setLoading(false);
            });
        }
    };


    const columns = [
        {
            key: "time",
            dataIndex: "created",
            title: "时间",
            render: (text: string, row: SystemRecord) => (
                <Text>{parseDate(row.time)}</Text>
            ),
        },
        {
            key: "level",
            dataIndex: "level",
            title: "标签",
            render: (text: string) => (
                <Tag color={text === "error" ? "red":"green"}>{text}</Tag>
            ),
        },
        {
            key: "sensor_mac",
            dataIndex: "sensor_mac",
            title: "传感器地址",
        },
        {
            key: "sensor_type",
            dataIndex: "sensor_type",
            title: "采集类型",
        },
        {
            key: "threshold_lower",
            dataIndex: "threshold_lower",
            title: "阈值下限",
            render: (text: string, row: SystemRecord) => (
                row.threshold_lower.toFixed(3)
            ),
        },
        {
            key: "threshold_upper",
            dataIndex: "threshold_upper",
            title: "阈值上限",
            render: (text: string, row: SystemRecord) => (
                row.threshold_upper.toFixed(3)
            ),
        },
        {
            key: "description",
            dataIndex: "description",
            title: "详细信息",
            render: (text: string, row: SystemRecord) => (
                <Tooltip title={row.description}>{row.description.slice(0, 10) + "..."}</Tooltip>
            ),
        },
    ];


    return (
        <Table loading={loading} size="small" scroll={{x: "max-content"}} columns={columns} dataSource={records}
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