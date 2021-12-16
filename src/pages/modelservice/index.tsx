import React from "react";
import {Col, Row} from "antd";
import {ModelList} from "./components/modellist";


const ModelService: React.FC = () => {
    return (
        <Row>
            <Col span={12}>
                <ModelList title="数据处理模型" modelType="process"/>
            </Col>
            <Col span={12}>
                <ModelList title="流处理异常检测模型" modelType="stream"/>
            </Col>
            <Col span={12}>
                <ModelList title="批处理异常检测模型" modelType="batch"/>
            </Col>
        </Row>
    );
};


export default ModelService;