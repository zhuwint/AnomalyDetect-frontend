import React, {useEffect, useState} from "react";
import {FetchModelParams, Model, ModelService} from "../../../services/service_model";
import {Alert, Col, Descriptions, Empty, Row} from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";

interface IProps {
    model: ModelService | null;
}


export const ModelPanel: React.FC<IProps> = (props) => {
    const [model, setModel] = useState<Model>();

    useEffect(() => {
        if (props.model) {
            FetchModelParams(props.model.name).then(res => {
                if (res.status === 0) {
                    setModel(res.data);
                }
            }).catch(() => {
            });
        }
    }, [props.model]);


    return (
        !props.model ? <Empty/> : (
            <Descriptions column={4} bordered={true} size="small">
                <DescriptionsItem label="模型名称" span={4}>
                    {props.model.name}
                </DescriptionsItem>
                <DescriptionsItem label="详细信息" span={20}>
                    <Alert message={model?.description} style={{whiteSpace: 'pre-wrap'}} showIcon={true} type="info"/>
                </DescriptionsItem>
                {
                    Object.keys(props.model.params).map((item, key) => {
                        return <DescriptionsItem label={item}>{props.model?.params[item]}</DescriptionsItem>;
                    })
                }
            </Descriptions>
        )
    );
};