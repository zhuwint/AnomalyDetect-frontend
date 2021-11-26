import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {ReducerState} from "../../redux";
import {FetchMeasurements, Location, Measurement, SensorInfo} from "../../services/service_controller";
import {useLocation} from "react-router-dom";
import {SensorSelector} from "../../components/selector/sensor";
import {TimeRange, TimeRangeSelector} from "../../components/selector/timerange";
import {Col, message, Row, Tabs} from "antd";
import {IntervalSelector} from "../../components/selector/interval";
import {DataBoard} from "./components/board";

// location 刷新时不消失
const DashBoard: React.FC = () => {
    const location = useLocation();
    const [sensor, setSensor] = useState<SensorInfo>();
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [timeRange, setTimeRange] = useState<TimeRange>({start: "", stop: ""});
    const [interval, setInterval] = useState<string>("");
    const [tabKey, setTabKey] = useState<string>("0");
    const project = useSelector((state: ReducerState) => state.global.project);

    useEffect(() => {
        // @ts-ignore  TODO: 这里没有做类型保护，不安全
        let _sensor = location.state && location.state.sensor;
        if (_sensor) {
            setSensor({
                sensor_mac: _sensor.sensor_mac || "",
                type_id: _sensor.type_id || "",
                type_name: _sensor.type_name || "",
                location1: _sensor.location1 || "",
                location2: _sensor.location2 || "",
                location3: _sensor.location3 || "",
                location4: _sensor.location4 || "",
            });
        } else {
            // TODO: 初始化sensor
        }
    }, [project]);


    useEffect(() => {
        // 当sensor变化时重新获取其measurement
        if (sensor) {
            const id = parseInt(sensor.type_id);
            if (id > 0) {
                FetchMeasurements(id).then(res => {
                    if (res.status === 0) {
                        setMeasurements(res.data);
                    } else {
                        message.error(res.msg).then(() => setMeasurements([]));
                    }
                });
            }
        }
    }, [sensor]);

    return (
        <div>
            <Row>
                <Col span={16}>
                    <SensorSelector onChange={setSensor}/>
                </Col>
                <Col span={8}>
                    <Row>
                        <Col span={18}>
                            <TimeRangeSelector onChange={setTimeRange}/>
                        </Col>
                        <Col span={6}>
                            <IntervalSelector onChange={setInterval}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br/>
            <Tabs tabPosition="left" defaultActiveKey="1" style={{height: "100vh"}}
                  onChange={value => setTabKey(value)}>
                {
                    measurements.map((measurement, index) => {
                        return (
                            <Tabs.TabPane tab={measurement.gather_type_name} key={index.toString()} forceRender>
                                {
                                    tabKey !== index.toString() || sensor === undefined ? null :
                                        <DataBoard sensorMac={sensor.sensor_mac}
                                                   measurement={measurement}
                                                   timeRange={timeRange}
                                                   interval={interval}
                                        />
                                }
                            </Tabs.TabPane>
                        );
                    })
                }
            </Tabs>
        </div>
    );
};


export default DashBoard;