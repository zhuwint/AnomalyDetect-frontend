import React, {useEffect, useState} from "react";
import {FetchTimeSeries, InfluxTable, Measurement} from "../../../services/service_controller";
import {TimeRange} from "../../../components/selector/timerange";
import {LineGraph} from "../../../components/graph/line";
import {useSelector} from "react-redux";
import {ReducerState} from "../../../redux";
import {message} from "antd";
import {useHistory} from "react-router-dom";


interface IProps {
    sensorMac: string;
    measurement: Measurement;
    timeRange: TimeRange;
    interval: string;
}

export const DataBoard: React.FC<IProps> = (props) => {
    const [data, setData] = useState<InfluxTable>();
    const project = useSelector((state: ReducerState) => state.global.project);
    const history = useHistory();

    useEffect(() => {
        if (project && project.id > 0) {
            const data = {
                project_id: project.id,
                start: props.timeRange.start,
                stop: props.timeRange.stop,
                interval: props.interval,
                filter: {
                    sensor_mac: props.sensorMac,
                    sensor_type: props.measurement.gather_type,
                    receive_no: props.measurement.receive_no.toString(),
                },
                group_by: {},
            };
            FetchTimeSeries(data).then(res => {
                if (res.status === 0) {
                    setData(res.data);
                } else {
                    message.error(res.msg);
                }
            }).catch(err => {
                message.error("未知错误");
            });
        }
    }, [props]);

    return (
        data === undefined ? null : <React.Fragment>
            {
                data.table.map((t, index) => {
                    return <LineGraph data={t} key={index.toString()}/>;
                })
            }
        </React.Fragment>
    );
};