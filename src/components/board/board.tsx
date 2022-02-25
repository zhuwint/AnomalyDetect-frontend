import React, {useEffect, useState} from "react";
import {FetchTimeSeries, Measurement, Point} from "../../services/service_controller";
import {TimeRange} from "../selector/timerange";
import {LineGraph, RegionMark} from "../graph/line";
import {useSelector} from "react-redux";
import {ReducerState} from "../../redux";
import {parseDate, parseDateUtc} from "../../utils/timetransform";


interface IProps {
    sensorMac: string;
    measurement: Measurement;
    timeRange: TimeRange;
    interval: string;
    height?: number;
    region?: RegionMark[];
}


export const TimeSeriesDataBoard: React.FC<IProps> = (props) => {
    const [data, setData] = useState<Point[]>([]);
    const project = useSelector((state: ReducerState) => state.global.project);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchTimeSeriesData();
    }, [props.sensorMac, props.measurement, props.timeRange, props.interval]);


    const fetchTimeSeriesData = () => {
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
                    res.data.forEach((item, index)=>{
                        res.data[index].time = parseDateUtc(res.data[index].time)
                    })
                    res.data.sort(function (a: Point, b: Point){
                        if (a.time < b.time) {
                            return -1
                        }
                        return 1
                    })

                    setData(res.data);
                    setError("");
                } else {
                    setError(res.msg);
                }
            }).catch(err => {
                setError(err.toString);
            });
        }
    };

    return (
        <LineGraph data={data} height={props.height} regionMark={props.region}/>
    );
};