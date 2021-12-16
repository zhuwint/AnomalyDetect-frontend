import React, {useState} from "react";
import {RecordList} from "./components/recordlist";
import {TimeRange, TimeRangeSelector} from "../../components/selector/timerange";
import {Card, Space} from "antd";

const SystemRecordPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>();


    return (
        <Card size="small" bordered={false} title="日志" extra={
            <Space align="center">
                <TimeRangeSelector onChange={setTimeRange}/>
            </Space>
        }>
            <RecordList taskId={null} view={null} start={timeRange?.start} end={timeRange?.stop}/>
        </Card>
    );
};

export default SystemRecordPage;