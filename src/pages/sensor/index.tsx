import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {ReducerState} from "../../redux";
import {Card, Input, message} from "antd";
import Title from "antd/es/typography/Title";
import {SensorInfo} from "../../services/service_controller";
import SensorList from "./components/table";
import {FetchSensors} from "../../services/service_controller";

const {Search} = Input;

const Sensor: React.FC = () => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const [sensors, setSensors] = useState<SensorInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchStr, setSearchStr] = useState<string>("");               // ""表示不进行搜素

    useEffect(() => {
        if (project !== undefined && project.id > 0) {
            setLoading(true);
            FetchSensors({project_id: project.id.toString()}).then(res => {
                if (res.status === 0) {
                    setSensors(res.data);
                } else {
                    message.error(res.msg, 2).then(() => {
                    });
                }
                setLoading(false);
            }).catch(() => {
                message.error("获取失败", 2).then(() => setLoading(false));
            });
        }
    }, [project]);

    return (
        <Card title={<Title level={4}>传感器列表</Title>} bordered={false} loading={loading}
              extra={<Search placeholder="全文检索" onSearch={value => setSearchStr(value)} allowClear={true}
                             enterButton={true}/>}>
            <SensorList sensors={sensors} search={searchStr}/>
        </Card>
    );
};


export default Sensor;