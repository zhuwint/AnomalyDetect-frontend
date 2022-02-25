import React, {useEffect, useState} from "react";
import {Button, Col, InputNumber, Row} from "antd";


interface IProps {
    index: number;
    defaultLower: number;
    defaultUpper: number;
    dispatch?: (index: number, lower: number, upper: number) => void;
}

export const ThresholdSetter: React.FC<IProps> = (props) => {
    const [lower, setLower] = useState<number>(props.defaultLower);
    const [upper, setUpper] = useState<number>(props.defaultUpper);
    const [update, setUpdate] = useState<boolean>(false);

    useEffect(() => {
        setLower(props.defaultLower);
        setUpper(props.defaultUpper);
    }, [props]);

    const cancel = () => {
        setLower(props.defaultLower);
        setUpper(props.defaultUpper);
        setUpdate(false);
    };

    const confirm = () => {
        setUpdate(false);
        if (props.dispatch) {
            props.dispatch(props.index, lower, upper);
        }
    };

    return <Row align="middle" gutter={4}>
        <Col span={3}>阈值下限</Col>
        <Col span={5}>
            <InputNumber size="small" style={{width: "100%"}} disabled={!update} value={lower} onChange={setLower}/>
        </Col>
        <Col span={3}>阈值上限</Col>
        <Col span={5}>
            <InputNumber size="small" style={{width: "100%"}} disabled={!update} value={upper} onChange={setUpper}/>
        </Col>
        <Col span={8}>
            {
                update ? <>
                    <Button type="link" size="small" onClick={confirm}>确定</Button>
                    <Button type="link" size="small" onClick={cancel}>撤销</Button>
                </> : <Button type="link" size="small" onClick={() => setUpdate(true)}>点击修改</Button>
            }
        </Col>
    </Row>;
};