import React, {useEffect, useState} from "react";
import {Button, Col, Input, InputNumber, Row} from "antd";


interface IProps {
    defaultValue?: number;
    onConfirm?: (data: number) => void;
}


export const ThresholdSetter: React.FC<IProps> = (props) => {
    const [value, setValue] = useState<number>(props.defaultValue? props.defaultValue: 0);
    const [update, setUpdate] = useState<boolean>(false)

    useEffect(() => {
        setValue(props.defaultValue? props.defaultValue: 0);
    }, [props]);

    const onChange = (v: number) => {
        setValue(v);
    };

    const cancel = () => {
        setValue(props.defaultValue? props.defaultValue: 0);
        setUpdate(false)
    };


    const confirm = () => {
        setUpdate(false)
        if(props.onConfirm) {
            props.onConfirm(value)
        }
    }

    return <Row align="middle">
        <Col span={16}>
            <InputNumber size="small" style={{width: "100%"}} disabled={!update} value={value} onChange={onChange}/>
        </Col>
        <Col span={8}>
            {
                update ? <>
                    <Button type="link" size="small" onClick={confirm}>确定</Button>
                    <Button type="link" size="small" onClick={cancel}>撤销</Button>
                </> : <Button type="link" size="small" onClick={()=>setUpdate(true)}>点击修改</Button>
            }
        </Col>
    </Row>;
};