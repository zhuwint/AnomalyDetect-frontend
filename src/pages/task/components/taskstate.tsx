import React from "react";
import {BatchMeta, BatchState, StreamMeta, StreamState} from "../../../services/service_task";
import {Descriptions, Tag} from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import {parseDate} from "../../../utils/timetransform";


interface IProps {
    state: StreamState | BatchState;
    info: BatchMeta | StreamMeta | null;
    isStream: boolean;
    dispatch?: () => void;
}

export const TaskState: React.FC<IProps> = (props) => {

    const onClick = () => {
        if (props.dispatch) {
            props.dispatch();
        }
    };

    let interval: number = 0;
    let days: number = 0;
    let gather: string = "";

    if (props.info) {
        if ("interval" in props.info) {
            interval = parseInt(props.info.interval) / 24;
            days = Math.abs(parseInt(props.info.query.range.start, 10)) / 24;
            gather = props.info.query.aggregate;
        }
    }

    return (
        <Descriptions size="small" bordered={true} column={4}>
            {
                interval > 0 ? <>
                    <DescriptionsItem label="执行间隔(单位: 天)">
                        {interval}
                    </DescriptionsItem>
                    <DescriptionsItem label="时间范围(过去几天)">
                        {days}
                    </DescriptionsItem>
                    <DescriptionsItem label="聚合粒度">
                        {gather}
                    </DescriptionsItem>
                </> : null
            }
            <DescriptionsItem label="状态">
                <Tag color={props.state.enable ? "#4080FF" : "#A9AEB8"} style={{width: "120px", textAlign: "center"}}>
                    <a onClick={onClick}>
                        {props.state.enable ? "运行中(点击暂停)" : "暂停中(点击运行)"}
                    </a>
                </Tag>
            </DescriptionsItem>
            <DescriptionsItem label="触发次数">
                {props.state.triggered}
            </DescriptionsItem>
            {
                props.isStream ? null : (
                    <>
                        <DescriptionsItem label="上一次触发时间">
                            {parseDate((props.state as BatchState).last)}
                        </DescriptionsItem>
                        <DescriptionsItem label="下一次触发时间">
                            {parseDate((props.state as BatchState).next)}
                        </DescriptionsItem>
                    </>
                )
            }
        </Descriptions>
    );

};