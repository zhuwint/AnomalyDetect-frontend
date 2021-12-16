import React, {useEffect, useState} from "react";
import {UnvariedSeries} from "../../services/service_task";
import {Col, message, Row, Tag} from "antd";
import {MeasurementSelector} from "./measurement";


interface IProps {
    mlt: boolean;
    dispatch?: (data: UnvariedSeries[]) => void;
    defaultValue?: UnvariedSeries;
}


export const DataSourceSelector: React.FC<IProps> = (props) => {
    const [dataSource, setDataSource] = useState<UnvariedSeries[]>([]);

    const dataSourceChanged = (data: UnvariedSeries) => {
        if (!props.mlt && dataSource.length > 0) {
            message.error("不支持多变量序列", 2);
            return;
        }

        const index = dataSource.findIndex(value => value.sensor_mac === data.sensor_mac && value.sensor_type === data.sensor_type && value.receive_no === data.receive_no);
        if (index >= 0) {
            message.warn("已存在", 2);
            return;
        }
        setDataSource([...dataSource, data]);
    };


    useEffect(() => {
        if (props.defaultValue) {
            setDataSource([...dataSource, props.defaultValue]);
        }
    }, []);

    useEffect(() => {
        if (props.dispatch) {
            props.dispatch(dataSource);
        }
    }, [dataSource]);

    const deleteDataSource = (sensor_mac: string, sensor_type: string, receive_no: string) => {
        setDataSource(dataSource.filter((item) => (
            item.sensor_mac !== sensor_mac || item.sensor_type !== sensor_type || item.receive_no !== receive_no
        )));
    };

    return (
        <div>
            <Row>
                {
                    dataSource.map((item, index) => {
                        return (
                            <Tag key={index} color={"#108ee9"} closable={true}
                                 onClose={() => deleteDataSource(item.sensor_mac, item.sensor_type, item.receive_no)}>
                                {item.sensor_mac + "-" + item.sensor_type + "-" + item.receive_no}
                            </Tag>
                        );
                    })
                }
            </Row>
            <Row style={{marginTop: "10px"}}>
                <Col span={24}>
                    <MeasurementSelector dispatch={dataSourceChanged}/>
                </Col>
            </Row>
        </div>
    );
};