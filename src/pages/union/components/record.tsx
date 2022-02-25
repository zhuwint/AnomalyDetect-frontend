import React, {useEffect, useState} from "react";
import {TimeRange, TimeRangeSelector} from "../../../components/selector/timerange";
import {Card, Table, Tag} from "antd";
import {AlertRecord, FetchAlertRecords} from "../../../services/service_record";
import {useSelector} from "react-redux";
import {ReducerState} from "../../../redux";
import {parseDate} from "../../../utils/timetransform";
import Text from "antd/es/typography/Text";


type R = {
    time: string
    alert: boolean
    description: string
}


interface IProps {
    taskId: string;
}

export const UnionRecordList: React.FC<IProps> = (props) => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const [range, setRange] = useState<TimeRange>({start: "", stop: ""});
    const [data, setData] = useState<R[]>([]);
    const [error, setError] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, [range]);

    const fetchData = () => {
        if (project) {
            setError("");
            setLoading(true);
            FetchAlertRecords(project.id, props.taskId,
                range.start === "" ? null : range.start,
                range.stop === "" ? null : range.stop).then(res => {
                if (res.status === 0) {
                    setData(buildRecord(res.data));
                } else {
                    setError(res.msg);
                }
                setLoading(false);
            }).catch(() => {
                setError("无法连接服务器");
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
                compare: (a: R, b: R) => a.time.localeCompare(b.time),
            },
        },
        // {
        //     title: "当前值",
        //     dataIndex: "value",
        //     key: "value",
        //     render: (text: number, row: AlertRecord) => <Text
        //         style={{color: text < row.threshold_lower || text > row.threshold_upper ? "red" : "green"}}>{text.toFixed(5)}</Text>,
        // },
        {
            title: "状态",
            dataIndex: "alert",
            key: 'alert',
            render: (text: boolean) => text ? <Text style={{color: 'red'}}>产生告警</Text> : <Text style={{color: 'green'}}>告警解除</Text>
        },
        {
            title: "详细信息",
            dataIndex: "description",
            key: "description",
            render: (text: string) => <Text style={{whiteSpace: 'pre-wrap'}}>{text}</Text>
        }
    ];

    return (
        <Card title="告警日志" bordered={false} size="small" extra={<TimeRangeSelector onChange={setRange}/>}>
            <Table columns={columns} dataSource={data} size="small" scroll={{x: "max-content", y: 200}}
                   loading={loading}
                   pagination={{
                       position: ["bottomCenter"],
                       pageSize: 6,
                       showSizeChanger: false,
                       current: currentPage,
                       onChange: (page) => setCurrentPage(page),
                       showQuickJumper: true,
                       hideOnSinglePage: true,
                   }}/>
        </Card>
    );
};


function buildRecord(data: AlertRecord[]) {
    let orderedData = data.sort((a, b) => a.time > b.time ? -1 : 1);
    let res: R[] = [];
    let temp: string[] = [];
    for (let i = 0; i < orderedData.length; i++) {
        if (i > 0 && orderedData[i].time !== orderedData[i - 1].time) {
            res.push({
                time: orderedData[i - 1].time,
                alert: orderedData[i - 1].alert,
                description: temp.join("\n"),
            });
            temp = [];
        }
        let satisfy: boolean = orderedData[i].threshold_lower <= orderedData[i].value && orderedData[i].threshold_upper >= orderedData[i].value;
        temp.push(`${orderedData[i].sensor_mac}-${orderedData[i].sensor_type}\t阈值下限:${orderedData[i].threshold_lower.toFixed(3)}\t阈值上限:${orderedData[i].threshold_upper.toFixed(3)}\t当前值:${orderedData[i].value.toFixed(3)}\t${satisfy ? "满足" : "不满足"}`);
    }
    if (temp.length > 0) {
        res.push({
            time: orderedData[orderedData.length-1].time,
            alert: orderedData[orderedData.length-1].alert,
            description: temp.join("\n")
        })
    }
    return res;
}