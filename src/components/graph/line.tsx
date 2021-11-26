import React, {useEffect, useState} from "react";
import {Line} from "@ant-design/charts";
import {TimeSeries} from "../../services/service_controller";


interface IProps {
    data: TimeSeries;
}


export const LineGraph: React.FC<IProps> = (props) => {

    useEffect(() => {

    }, [props]);

    const config = {
        data: props.data.rows,
        xField: "time",
        yField: "value",
        meta: {
            value: {
                min: "min",
                max: "max",
            },
            time: {
                type: "time",
            },
        },
        brush: {
            enable: true,
            type: "rect",
            action: "filter",
            mask: {
                style: {
                    fill: 'rgba(255,0,0,0.15)',
                },
            },
            button: {
                text: "重置",
            }
        }
    };

    return (
        <Line {...config} height={200}/>
    );
};
