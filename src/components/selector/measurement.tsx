import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Row, Select} from "antd";
import {SensorSelector} from "./sensor";
import {FetchMeasurements, Measurement, SensorInfo} from "../../services/service_controller";
import {UnvariedSeries} from "../../services/service_task";
import "./styles/index.css";

interface IProps {
    dispatch?: (data: UnvariedSeries) => void;
}

export const MeasurementSelector: React.FC<IProps> = (props) => {
    const [sensor, setSensor] = useState<SensorInfo>();
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [selectedMeasurement, setSelectMeasurement] = useState<string>("");
    const [error, setError] = useState<string>("");

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

    useEffect(() => {

    }, [sensor]);

    const submit = () => {
        const res: string[] = selectedMeasurement.split(" ");
        if (res.length === 2 && sensor) {
            setError("");
            const data: UnvariedSeries = {
                sensor_mac: sensor.sensor_mac,
                sensor_type: res[0],
                receive_no: res[1],
            };
            if (props.dispatch) {
                props.dispatch(data);
            }
        } else {
            setError("请先选择传感器和测点");
        }
    };

    return (
        <Row>
            <Col span={12}>
                <SensorSelector onChange={onSensorChanged}/>
            </Col>
            <Col span={4}>
                <Select className="my-selector" value={selectedMeasurement}
                        onChange={value => setSelectMeasurement(value)}
                        size="small" bordered={false}>
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
            <Col style={{marginLeft: "10px"}}>
                <Button size="small" type="primary" onClick={submit}>确定</Button>
            </Col>
            <Col style={{marginLeft: "10px"}}>
                {
                    error !== "" ? <Alert type="error" message={error} showIcon={true}/> : null
                }
            </Col>
        </Row>
    );
};