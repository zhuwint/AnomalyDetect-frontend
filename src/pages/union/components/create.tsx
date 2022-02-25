import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Button, Card, Col, Form, Input, InputNumber, message, Row, Select} from "antd";
import {LeftOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {ReducerState} from "../../../redux";
import {SeriesSelector} from "../../../components/selector/series";
import {CreateUnionTask, UnionMeta, UnionTaskInfo} from "../../../services/service_task";
import Text from "antd/es/typography/Text";
import assert from "assert";

export const CreateTask: React.FC = () => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const history = useHistory();
    const [form] = Form.useForm();
    const [series, setSeries] = useState<UnionMeta[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [operator, setOperator] = useState<number[]>([]);
    const [selectOp, setSelectOp] = useState<number>(0);

    const addSeries = (s: UnionMeta) => {
        for (let i = 0; i < series.length; i++) {
            if (series[i].sensor_mac === s.sensor_mac && series[i].sensor_type === s.sensor_type && series[i].receive_no === s.receive_no) {
                message.error("该测量点已存在", 2);
                return;
            }
        }
        if (series.length > 0) {
            setOperator([...operator, selectOp]);
        }
        setSeries([...series, s]);
    };


    useEffect(() => {
        form.setFieldsValue({"level": "1", "name": ""});
    }, []);

    useEffect(() => {

    }, [series]);

    console.log(series.length, operator.length);

    const delSeries = (index: number) => {
        let newSeries: UnionMeta[] = [];
        let newOp: number[] = [];
        for (let i = 0; i < series.length; i++) {
            if (i !== index) {
                newSeries.push(series[i]);
                if (i !== 0 && newSeries.length >= 2) {
                    newOp.push(operator[i - 1]);
                }
            }
        }
        // if (newSeries.length !== newOp.length + 1) {
        //     console.log("series length != operator length + 1");
        // }
        setSeries(newSeries);
        setOperator(newOp);
    };

    const submit = () => {
        if (project) {
            form.validateFields().then(res => {
                const name = res.name;
                const level = res.level;
                if (series.length < 2) {
                    setError("请至少选择2个测量点");
                } else {
                    let data: UnionTaskInfo = {
                        task_id: "",
                        task_name: name,
                        project_id: project.id,
                        bucket: "yinao",
                        measurement: "sensor_data",
                        duration: "1m",
                        level: parseInt(level),
                        series: series,
                        operate: operator,
                        is_stream: true,
                    };
                    setLoading(true);
                    setError("");
                    CreateUnionTask(data).then(res => {
                        setLoading(false);
                        if (res.status !== 0) {
                            message.error("创建失败", 2);
                            setError(res.msg);
                        } else {
                            message.success("创建成功", 1).then(() => history.goBack());
                        }
                    }).catch(() => {
                        setLoading(false);
                        message.error("创建失败", 2);
                    });
                }
            }).catch(() => {
            });
        }

    };

    return (
        <div>
            <Button type="link" icon={<LeftOutlined/>} onClick={() => history.goBack()}>
                返回
            </Button>
            <br/>
            <Card title="基本信息" size="small" bordered={false}>
                <Form form={form} labelCol={{span: 4}} wrapperCol={{span: 8}}>
                    <Form.Item name="name" label="任务名称" rules={[{required: true}, {type: "string", min: 4, max: 20}]}>
                        <Input size="small"/>
                    </Form.Item>
                    <Form.Item name="level" label="告警等级">
                        <Select size="small">
                            <Select.Option value="1">通知</Select.Option>
                            <Select.Option value="2">重要</Select.Option>
                            <Select.Option value="3">紧急</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Card>
            <Card title="测量点" size="small" bordered={false}>
                {
                    series.map((item, index) => {
                        return (
                            <Row gutter={8} style={{padding: "4px 0"}}>
                                <Col span={1}>{index === 0 ? null : (operator[index - 1] === 0 ? "且" : "或")}</Col>
                                <Col span={1}>{index + 1}</Col>
                                <Col span={4}>
                                    <Input size="small" value={item.sensor_mac + "-" + item.sensor_type}
                                           disabled={true}/>
                                </Col>
                                <Col span={2} style={{textAlign: "right"}}>阈值下限：</Col>
                                <Col span={3}>
                                    <InputNumber style={{width: "100%"}} size="small" value={item.threshold_lower}
                                                 disabled={true}/>
                                </Col>
                                <Col span={2} style={{textAlign: "right"}}>阈值上限：</Col>
                                <Col span={3}>
                                    <InputNumber style={{width: "100%"}} size="small" value={item.threshold_upper}
                                                 disabled={true}/>
                                </Col>
                                <Col span={2}>
                                    <Button size="small" type="link" onClick={() => delSeries(index)}>删除</Button>
                                </Col>
                            </Row>
                        );
                    })
                }
                <br/>
                <Row gutter={8}>
                    {
                        series.length === 0 ? null : <Col span={2}>
                            <Select size="small" style={{width: "100%"}} value={selectOp} onChange={setSelectOp}>
                                <Select.Option value={0}>且</Select.Option>
                                <Select.Option value={1}>或</Select.Option>
                            </Select>
                        </Col>
                    }
                    <Col span={series.length === 0 ? 24 : 22}>
                        <SeriesSelector dispatch={addSeries}/>
                    </Col>
                </Row>
                <br/>
                注："且"表示2个测量点都必须满足阈值区间，有一者不满足则产生告警
                <br/>
                "或"表示若有2个测量点之一满足阈值区间或都满足阈值区间则不告警，否则产生告警
            </Card>
            {
                error === "" ? null : <Text style={{color: "red"}}>{error}</Text>
            }
            <Card size="small" bordered={false} extra={
                <Button size="small" type="primary" onClick={submit} loading={loading}>提交</Button>
            }/>
        </div>
    );
};