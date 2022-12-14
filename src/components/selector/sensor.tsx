import React, {useEffect, useState} from "react";
import {Card, Col, message, Row, Select} from "antd";
import {LocationSelect, LocationTreeNode} from "./location";
import {useSelector} from "react-redux";
import {ReducerState} from "../../redux";
import {FetchSensors, SensorInfo, SensorQuery} from "../../services/service_controller";
import "./styles/index.css";


interface IProps {
    onChange?: (data: SensorInfo) => void;
    defaultValue?: SensorInfo;
}

export const SensorSelector: React.FC<IProps> = (props) => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const [sensors, setSensors] = useState<SensorInfo[]>([]);
    const [selected, setSelected] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (props.defaultValue) {
            setSelected(props.defaultValue.sensor_mac);
        } else {
            setSelected("");
        }
    }, [project]);

    const selectSensorChanged = (sensorMac: string) => {
        setSelected(sensorMac);
        let sensor = sensors.find(value => value.sensor_mac === sensorMac);
        if (sensor === undefined) {
            throw new Error("传感器不存在");
        }
        if (props.onChange) {
            props.onChange(sensor);
        }
    };


    const locationChanged = (option: LocationTreeNode) => {
        setSelected("");
        setSensors([]);
        if (project) {
            setLoading(true);
            FetchSensors({
                project_id: project.id.toString(),
                location1: option.location_1_id.toString(),
                location2: option.location_2_id.toString(),
                location3: option.location_3_id.toString(),
                location4: option.location_4_id.toString(),
            }).then(res => {
                if (res.status === 0) {
                    setSensors(res.data);
                } else {
                    message.error("获取传感器失败");
                }
                setLoading(false);
            });
        }
    };


    return (
        <Row align="middle" gutter={8}>
            <Col span={16}>
                <LocationSelect onChange={locationChanged}/>
            </Col>
            <Col span={8}>
                <Select placeholder="请选择传感器" showSearch optionFilterProp="children" loading={loading}
                        className="my-selector" size="small"
                        filterOption={
                            (input, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={value => selectSensorChanged(value)}
                        value={selected}
                        bordered={false}
                >
                    {
                        sensors.map((value, index) => {
                            return <Select.Option value={value.sensor_mac}
                                                  key={index}>{value.sensor_mac + value.type_name}</Select.Option>;
                        })
                    }
                </Select>
            </Col>
        </Row>
    );
};