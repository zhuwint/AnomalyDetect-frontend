import React, {useEffect, useState} from "react";
import {InputNumber, Space} from "antd";
import {StreamMeta} from "../../../services/service_task";
import Text from "antd/es/typography/Text";


interface IProps {
    dispatch?: (data: StreamMeta) => void;
}

export const StreamMetaForm: React.FC<IProps> = (props) => {
    const [duration, setDuration] = useState<string>("1h");

    useEffect(() => {
        if (props.dispatch) {
            props.dispatch({
                bucket: "yinao",
                measurement: "sensor_data",
                duration: duration,
                series: null,
            });
        }
    }, [duration]);

    return (
        <div>
            <Space align="center">
                <Text>持续多少时间告警(单位小时, 0 表示立即): </Text>
                <InputNumber size="small" min={0} defaultValue={0} precision={0}
                             onChange={value => setDuration(value.toString() + "h")}/>
            </Space>
        </div>
    );
};