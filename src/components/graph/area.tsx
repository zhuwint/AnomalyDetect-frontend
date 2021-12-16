import React from "react";
import {Area} from "@ant-design/charts";
import {Point} from "../../services/service_controller";
import {parseDate} from "../../utils/timetransform";


interface IProps {
    data: Point[];
    height?: number;
}

export const AreaGraph: React.FC<IProps> = (props) => {
    const config = {
        data: props.data,
        xField: 'time',
        yField: 'value',
        seriesField: 'field_tag',
        xAxis: {
            tickCount: 5,
        },
        padding: [16,8,16,8],
        animation: false,
        slider: {
            start: 0.0,
            end: 1.0,
            height: 20,
            trendCfg: {
                isArea: true,
            },
            formatter: (value: string) => parseDate(value),
        },
        meta: {
            scale: {
                min: "min",
                max: "max",
            },
        },
        height: props.height ? props.height : 200,
    };

    return <Area {...config}/>;
};