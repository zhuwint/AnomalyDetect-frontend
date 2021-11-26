import React, {useEffect} from "react";
import {DatePicker} from "antd";
import {parseDate, parseDateUtc} from "../../utils/timetransform";
import "./styles/index.css";
import moment from "moment";

const {RangePicker} = DatePicker;

const timeFormat = "YYYY-MM-DD HH:mm:ss";

// 时间范围，格式为utc时间戳, 如 2018-11-05T23:30:00Z
export interface TimeRange {
    start: string,
    stop: string
}

// 时间范围选择器
export const TimeRangeSelector: React.FC<{ onChange?: (data: TimeRange) => void }> = ({onChange}) => {
    const defaultRange = InitTimeRange();

    useEffect(() => {
        // 初始化时设置一次父组件时间
        if (onChange) {
            onChange(defaultRange);
        }
    }, []);

    const onOk = (value: any) => {
        if (onChange) {
            onChange({
                start: value[0].format(timeFormat),
                stop: value[1].format(timeFormat),
            });
        }
    };

    // 没有设置onchange回调，只有当点击onOk时才触发改动

    return (
        <RangePicker
            showTime
            onOk={onOk}
            bordered={false}
            className="my-selector"
            allowClear={false}
            disabledDate={disabledDate}
            defaultValue={[moment(defaultRange.start, timeFormat), moment(defaultRange.stop, timeFormat)]}
            format={timeFormat}
        />
    );
};


function InitTimeRange(): TimeRange {
    let now = new Date();
    let _stop = parseDate(now.toUTCString());
    now.setTime(now.setDate(now.getDate() - 7));
    let _start = parseDate(now.toUTCString());
    return {
        start: _start,
        stop: _stop,
    };
}

function disabledDate(current: moment.Moment) {
    return current && current > moment().endOf("day");
}