import React, {useEffect, useState} from "react";
import {UnvariedSeries} from "../../../services/service_task";
import {Col, Empty, Row} from "antd";
import {SensorSelector} from "../../../components/selector/sensor";
import {TimeRange, TimeRangeSelector} from "../../../components/selector/timerange";
import {IntervalSelector} from "../../../components/selector/interval";
import {DataBoard} from "../../dashboard/components/board";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import {TimeSeriesDataBoard} from "../../../components/board/board";


interface IProps {
    data?: UnvariedSeries;
}


export const DataPanel: React.FC<IProps> = (props) => {
    const [timeRange, setTimeRange] = useState<TimeRange>({start: "", stop: ""});
    const [interval, setInterval] = useState<string>("");

    useEffect(() => {

    }, [props.data]);

    return (
        !props.data ? <Empty/> : <div>
            <Row align="middle">
                <Col span={6}>
                    <Title level={5}>{props.data.sensor_mac + " " + props.data.sensor_type}</Title>
                </Col>
                <Col span={8}>
                    <TimeRangeSelector onChange={setTimeRange}/>
                </Col>
                <Col span={4}>
                    <IntervalSelector onChange={setInterval}/>
                </Col>
            </Row>
            <TimeSeriesDataBoard sensorMac={props.data.sensor_mac}
                                 measurement={
                                     {
                                         receive_no: parseInt(props.data.receive_no),
                                         gather_type: props.data.sensor_type,
                                         gather_type_name: "目标序列",
                                         unit: "",
                                     }
                                 }
                                 timeRange={timeRange}
                                 interval={interval}
            />
        </div>
    );
};