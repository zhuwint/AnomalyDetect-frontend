import React from "react";
import {BatchState, StreamState} from "../../../services/service_task";
import {Descriptions, Tag} from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import {parseDate} from "../../../utils/timetransform";


interface IProps {
    state: StreamState | BatchState;
    isStream: boolean;
    dispatch?: () => void;
}

export const TaskState: React.FC<IProps> = (props) => {

    const onClick = () => {
        if (props.dispatch) {
            props.dispatch();
        }
    };

    return (
        <Descriptions size="small" bordered={true} column={4}>
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