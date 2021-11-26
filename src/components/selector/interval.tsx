import React, {useEffect} from "react";
import {Select} from "antd";
import "./styles/index.css";
import {createInterface} from "readline";

const intervalOptions = [
    {
        value: "15m",
        name: "15 minute",
    },
    {
        value: "30m",
        name: "30 minute",
    },
    {
        value: "1h",
        name: "1 hour",
    },
    {
        value: "2h",
        name: "2 hour",
    },
    {
        value: "1d",
        name: "1 day",
    },
];

const defaultInterval = "30m";

export const IntervalSelector: React.FC<{ onChange?: (value: string) => void }> = ({onChange}) => {
    useEffect(() => {
        intervalChange(defaultInterval);
    }, []);

    // 修改interval
    const intervalChange = (value: string) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <Select bordered={false} defaultValue={defaultInterval} onChange={intervalChange}>
            {
                intervalOptions.map((value, index) => {
                    return <Select.Option value={value.value} key={index}>{value.name}</Select.Option>;
                })
            }
        </Select>
    );
};


