import React, {useEffect, useState} from "react";
import {TimeRange} from "../../../components/selector/timerange";
import {useSelector} from "react-redux";
import {ReducerState} from "../../../redux";
import {AlertRecord, FetchAlertRecords} from "../../../services/service_record";
import {Table, Tag} from "antd";
import {parseDate} from "../../../utils/timetransform";


interface IProps {
    taskId: string,
    range: TimeRange,
    setRecord?: (data: AlertRecord[]) => void
}


export const AlertRecordList: React.FC<IProps> = (props) => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const [data, setData] = useState<AlertRecord[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);


    useEffect(() => {
        fetchData();
    }, [props.taskId, props.range]);

    const fetchData = () => {
        if (project) {
            setLoading(true);
            FetchAlertRecords(project.id, props.taskId, props.range.start, props.range.stop).then(res => {
                if (res.status === 0) {
                    res.data.sort(function (a: AlertRecord, b: AlertRecord) {
                        if (a.time > b.time) {
                            return -1;
                        }
                        return 1;
                    });
                    setData(res.data.sort((a, b) => a.time > b.time ? -1 : 1));
                    if (props.setRecord) {
                        props.setRecord(res.data);
                    }
                } else {
                    setError(res.msg);
                }
                setLoading(false);
            }).catch(err => {
                setError(err.toString());
                setLoading(false);
            });
        }
    };

    const columns = [
        {
            title: "时间",
            dataIndex: "time",
            key: "time",
            render: (text: string) => parseDate(text),
            sorter: {
                compare: (a: AlertRecord, b: AlertRecord) => a.time.localeCompare(b.time),
            },
        },
        {
            title: "数据范围",
            children: [
                {
                    title: "开始",
                    dataIndex: "start",
                    key: "start",
                    render: (text: string) => parseDate(text),
                },
                {
                    title: "结束",
                    dataIndex: "stop",
                    key: "stop",
                    render: (text: string) => parseDate(text),
                },
            ],
        },
        {
            title: "阈值下限",
            dataIndex: "threshold_lower",
            key: "threshold_lower",
            render: (text: number) => text.toFixed(5),
        },
        {
            title: "阈值上限",
            dataIndex: "threshold_upper",
            key: "threshold_upper",
            render: (text: number) => text.toFixed(5),
        },
        {
            title: "当前值",
            dataIndex: "value",
            key: "value",
            render: (text: number) => text.toFixed(5),
        },
        {
            title: "状态",
            dataIndex: "alert",
            key: "alert",
            render: (text: boolean) => (
                <Tag color={text ? "#F53F3F" : "#4CD263"}>{text ? "异常" : "正常"}</Tag>
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
            onFilter: (text: string | number | boolean, record: AlertRecord) => record.alert === text,
        },
    ];

    return (
        <Table columns={columns} dataSource={data} size="small" scroll={{x: "max-content", y: 200}} loading={loading}
               pagination={{
                   position: ["bottomCenter"],
                   pageSize: 6,
                   showSizeChanger: false,
                   current: currentPage,
                   onChange: (page) => setCurrentPage(page),
                   showQuickJumper: true,
                   hideOnSinglePage: true,
               }}/>
    );
};