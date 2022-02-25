import React, {useEffect, useState} from "react";
import {UnionMeta} from "../../services/service_task";
import {SensorSelector} from "./sensor";
import {FetchMeasurements, Measurement, SensorInfo} from "../../services/service_controller";
import {Button, Col, InputNumber, Row, Select} from "antd";
import Text from "antd/es/typography/Text";

interface IProps {
    dispatch?: (ts: UnionMeta) => void;
}


export const SeriesSelector: React.FC<IProps> = (props) => {
    const [series, setSeries] = useState<UnionMeta[]>([]);
    const [sensor, setSensor] = useState<SensorInfo>();
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [selectedMeasurement, setSelectMeasurement] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [lower, setLower] = useState<number>(0.0);
    const [upper, setUpper] = useState<number>(0.0);

    useEffect(() => {

    }, series);

    const add = () => {
        const res: string[] = selectedMeasurement.split(" ");
        if (res.length === 2 && sensor) {
            if (lower >= upper) {
                setError("阈值下限必须小于上限");
                return;
            }
            setError("");
            const data: UnionMeta = {
                sensor_mac: sensor.sensor_mac,
                sensor_type: res[0],
                receive_no: res[1],
                threshold_lower: lower,
                threshold_upper: upper,
            };
            if (props.dispatch) {
                props.dispatch(data);
            }
        } else {
            setError("请选择传感器与测量点");
        }
    };

    const onSensorChanged = (sensor: SensorInfo) => {
        setSensor(sensor);
        setSelectMeasurement("");
        FetchMeasurements(parseInt(sensor.type_id)).then(res => {
            if (res.status === 0) {
                setMeasurements(res.data);
            } else {
                setError(res.msg);
            }
        }).catch(() => {
            setError("获取测量点失败");
        });
    };

    return (
        <div>
            <Row gutter={8}>
                <Col span={9}>
                    <SensorSelector onChange={onSensorChanged}/>
                </Col>
                <Col span={3}>
                    <Select value={selectedMeasurement}
                            onChange={value => setSelectMeasurement(value)}
                            size="small" bordered={false} style={{width: "100%", backgroundColor: "#E5E6EB"}}>
                        {
                            measurements.map((item, index) => {
                                return <Select.Option value={item.gather_type + " " + item.receive_no.toString()}
                                                      key={index.toString()}>
                                    {item.gather_type_name}
                                </Select.Option>;
                            })
                        }
                    </Select>
                </Col>
                <Col span={2} style={{textAlign: "right"}}>阈值下限：</Col>
                <Col span={3}>
                    <InputNumber style={{width: "100%"}} size="small" defaultValue={0.0} onChange={setLower}/>
                </Col>
                <Col span={2} style={{textAlign: "right"}}>阈值上限：</Col>
                <Col span={3}>
                    <InputNumber style={{width: "100%"}} size="small" defaultValue={0.0} onChange={setUpper}/>
                </Col>
                <Col span={2}>
                    <Button type="primary" size="small" onClick={add}>添加</Button>
                </Col>
            </Row>
            {
                error !== "" ? <Text style={{color: "red", textAlign: "right"}}>{error}</Text> : null
            }
        </div>
    );
};
