import React, {useState} from "react";
import {SensorInfo} from "../../../services/service_controller";
import {Button, Table} from "antd";
import {useHistory} from "react-router-dom";

// import history from "../../../history";

interface Row extends SensorInfo {
    key: string;
}

const SensorList: React.FC<{ sensors: SensorInfo[], search: string }> = ({sensors, search}) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    let history = useHistory();

    const viewSensor = (record: Row) => {
        const info: SensorInfo = {
            sensor_mac: record.sensor_mac,
            type_id: record.type_id,
            type_name: record.type_name,
            location1: record.location1,
            location2: record.location2,
            location3: record.location3,
            location4: record.location4,
        };
        history.push({
            pathname: "/dashboard", state: {
                sensor: info,
            },
        });
    };

    const columns = [
        {
            title: "传感器地址",
            dataIndex: "sensor_mac",
            key: "sensor_mac",
            sorter: {
                compare: (a: Row, b: Row) => a.sensor_mac.localeCompare(b.sensor_mac),
            },
        },
        {
            title: "位置1",
            dataIndex: "location1",
            key: "location1",
            sorter: {
                compare: (a: Row, b: Row) => a.location1.localeCompare(b.location1),
            },
        },
        {
            title: "位置2",
            dataIndex: "location2",
            key: "location2",
        },
        {
            title: "位置3",
            dataIndex: "location3",
            key: "location3",
        },
        {
            title: "位置4",
            dataIndex: "location4",
            key: "location4",
        },
        {
            title: "传感器类型",
            dataIndex: "type_name",
            key: "type_name",
            sorter: {
                compare: (a: Row, b: Row) => a.type_name.localeCompare(b.type_name),
            },
        },
        {
            title: "操作",
            key: "action",
            render: (text: string, record: Row) => (
                <Button type="link" size="small" onClick={() => viewSensor(record)}>查看</Button>
            ),
        },
    ];

    let _sensors: Row[] = [];
    // 给每个元素添加 key 属性防止报警告
    sensors.forEach((sensor, index) => {
        let display: boolean = false;
        if (search !== "") {
            // TODO: 目前是对所有字段进行搜索，但实际上table显示的并不是所有字段
            Object.values(sensor).forEach(value => {
                if (value.toString().indexOf(search) !== -1) {
                    display = true;
                    return;
                }
            });
        }
        if (display || search === "") {
            _sensors.push(Object.assign({}, sensor, {"key": index.toString()}));
        }
    });

    return (
        <Table columns={columns} dataSource={_sensors} size="small" scroll={{x: "max-content"}}
               pagination={{
                   position: ["bottomCenter"],
                   pageSize: 12,
                   showSizeChanger: false,
                   current: currentPage,
                   onChange: (page) => setCurrentPage(page),
                   showQuickJumper: true,
                   hideOnSinglePage: true,
               }}/>
    );
};


export default SensorList;