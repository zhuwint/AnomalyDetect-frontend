import React, {useEffect} from "react";
import {Line} from "@ant-design/charts";
import {Point} from "../../services/service_controller";
import {parseDate, parseTime} from "../../utils/timetransform";


export type RegionMark = {
    start: string,          // 这个字段暂时不用
    end: string
    alert: boolean
}


interface IProps {
    data: Point[];
    height?: number;
    regionMark?: RegionMark[];
}


export const LineGraph: React.FC<IProps> = (props) => {
    let regions: any[] = [];
    if (props.regionMark && props.data.length > 0) {
        let i = 0;        // 数据索引
        let j = 0;
        props.regionMark.forEach((item, index) => {
            for (; j < props.data.length - 1; j++) {
                if (props.data[j].time > item.start) {     // 比第一个小
                    break;
                }
                if (props.data[j].time <= item.start && props.data[j + 1].time > item.start) {
                    break;
                }
            }
            let start = index === 0 ? props.data[0].time : regions[regions.length - 1].end[0];
            for (; i < props.data.length - 1; i++) {
                if (props.data[i].time <= item.end && props.data[i + 1].time > item.end) {
                    break;
                }
            }
            let r: any = {
                type: "region",
                start: [props.data[j].time, "min"],
                end: [props.data[i].time, "max"],
                style: {
                    fill: item.alert ? "red" : "green",
                },
                animate: false,
            };
            regions.push(r);
        });

        // 尚未进行异常检测的区间
        let start = regions.length === 0 ? props.data[0].time : regions[regions.length - 1].end[0];
        regions.push({
            type: "region",
            start: [start, "min"],
            end: [props.data[props.data.length - 1].time, "max"],
            style: {
                fill: "yellow",
            },
            animate: false,
        });
    }

    const config = {
        data: props.data,
        xField: "time",
        yField: "value",
        seriesField: "field_tag",
        meta: {
            value: {
                min: "min",
                max: "max",
                formatter: (value: number) => value.toFixed(4),
            },
            time: {
                // type: "time",
                formatter: (value: number) => parseDate(value),
            },
        },
        xAxis: {
            tickCount: 5,
        },
        slider: {
            start: 0,
            end: 1,
            height: 20,
            trendCfg: {
                isArea: false,
            },
            formatter: (value: string) => parseDate(value),
        },
        height: props.height ? props.height : 200,
        annotations: [
            ...regions,
        ],
    };

    return (
        <Line {...config} />
    );
};
