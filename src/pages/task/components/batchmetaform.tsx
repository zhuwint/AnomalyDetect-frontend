import React, {useEffect, useState} from "react";
import {Button, Col, Form, InputNumber, Space} from "antd";
import {BatchMeta, UnvariedSeries} from "../../../services/service_task";
import Text from "antd/es/typography/Text";
import {TimeRange, TimeRangeSelector} from "../../../components/selector/timerange";
import {IntervalSelector} from "../../../components/selector/interval";
import {useSelector} from "react-redux";
import {ReducerState} from "../../../redux";


interface IProps {
    mlt?: boolean;          // 是否支持多变量
    dispatch?: (data: BatchMeta) => void;
}


export const BatchMetaForm: React.FC<IProps> = (props) => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const [period, setPeriod] = useState<string>("24h");
    const [range, setRange] = useState<TimeRange>({start: "-168h", stop: "now()"});
    const [aggregate, setAggregate] = useState<string>("30m");

    useEffect(() => {
        if (props.dispatch) {
            props.dispatch({
                interval: period,
                query: {
                    measurement: "sensor_data",
                    range: range,
                    aggregate: aggregate,
                },
            });
        }
    }, [period, range, aggregate, project]);

    return (
        <div>
            <Space align="center" size="small">
                <Text>执行间隔(单位: 天): </Text>
                <InputNumber size="small" min={1} precision={0} defaultValue={1}
                             onChange={value => setPeriod((value * 24).toString() + "h")}/>
                <Text>时间范围(过去几天): </Text>
                <InputNumber size="small" min={1} precision={0} defaultValue={7}
                             onChange={value => setRange({start: "-" + (value * 24).toString() + "h", stop: "now()"})}/>
                <Text>聚合粒度: </Text>
                <IntervalSelector onChange={value => setAggregate(value)}/>
            </Space>
        </div>
    );
};