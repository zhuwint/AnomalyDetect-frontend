import React, {useEffect, useState} from "react";
import {Button, Card, Form, message, Select, Switch} from "antd";
import {ModelSelector} from "../../../components/selector/model";
import {ModelService} from "../../../services/service_model";
import {BatchMetaForm} from "./batchmetaform";
import {StreamMetaForm} from "./streammetaform";
import {BatchMeta, CreateStreamTask, StreamMeta, StreamTaskInfo, UnvariedSeries} from "../../../services/service_task";
import {DataSourceSelector} from "../../../components/selector/datasource";
import {useSelector} from "react-redux";
import {ReducerState} from "../../../redux";
import {useHistory} from "react-router-dom";
import {useQuery} from "../../../utils/useQuery";
import {Compute} from "./compute";


interface IProps {
}


export const StreamTaskForm: React.FC<IProps> = (props) => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const history = useHistory();
    const query = useQuery();
    const [useDataProcess, setUseDataProcess] = useState<boolean>(false);
    const [dataProcessModel, setDataProcessModel] = useState<ModelService>();
    const [detectModel, setDetectModel] = useState<ModelService>();
    const [supportMlt, setSupportMlt] = useState<boolean>(false); // 是否支持多变量时间序列
    const [target, setTarget] = useState<UnvariedSeries[]>([]);      // 因变量,只能有一个
    const [dataSource, setDataSource] = useState<UnvariedSeries[]>([]);    // 其它自变量
    const [modelUpdate, setModelUpdate] = useState<BatchMeta>();
    const [anomalyDetect, setAnomalyDetect] = useState<StreamMeta>();
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({"level": "1"});
    }, []);

    const submit = () => {
        const formData = form.getFieldsValue();
        if (formData.level) {
            if (project) {
                if (!modelUpdate) {
                    message.error("请设置模型更新项");
                    return;
                }
                if (!detectModel) {
                    message.error("请设置异常检测模型");
                    return;
                }
                if (!anomalyDetect) {
                    message.error("请设置异常检测项");
                    return;
                }
                if (target.length !== 1) {
                    message.error("请选择目标检测序列");
                    return;
                }
                const data: StreamTaskInfo = {
                    anomaly_detect: anomalyDetect,
                    detect_model: detectModel,
                    is_stream: true,
                    level: parseInt(formData.level),
                    target: target[0],
                    independent: dataSource,
                    model_update: modelUpdate,
                    preprocess: dataProcessModel ? dataProcessModel : null,
                    project_id: project.id,
                    task_id: "",
                };
                setLoading(true);
                CreateStreamTask(data).then(res => {
                    setLoading(false);
                    if (res.status === 0) {
                        message.success("创建成功", 1);
                        history.push("/task");
                    } else {
                        message.error(res.msg, 2);
                    }
                }).catch((err) => {
                    message.error("无法连接服务器");
                    setLoading(false);
                });
            }
        } else {
            message.error("请输入taskId");
        }
    };

    let defaultTarget: UnvariedSeries | undefined = undefined;
    const sensor_mac = query.get("sensor_mac");
    const receive_no = query.get("receive_no");
    const sensor_type = query.get("sensor_type");
    if (sensor_mac && receive_no && sensor_type) {
        defaultTarget = {
            sensor_type: sensor_type,
            receive_no: receive_no,
            sensor_mac: sensor_mac,
        };
    }

    return (
        <div>
            <Card title="基本项" size="small" bordered={false}>
                <Form form={form} layout="inline">
                    <Form.Item name="level" label="告警等级">
                        <Select size="small">
                            <Select.Option value="1">通知</Select.Option>
                            <Select.Option value="2">重要</Select.Option>
                            <Select.Option value="3">紧急</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Card>
            <Card title="数据预处理" size="small" bordered={false}
                  extra={<Switch size="small" onChange={setUseDataProcess}/>}>
                {
                    useDataProcess ? <ModelSelector type="process" dispatch={setDataProcessModel}/> : null
                }
            </Card>
            <Card title="异常检测模型" size="small" bordered={false}>
                <ModelSelector type="stream" dispatch={setDetectModel} setMlt={setSupportMlt}/>
            </Card>
            <Card title="目标检测序列" size="small" bordered={false}>
                <DataSourceSelector defaultValue={defaultTarget} mlt={false} dispatch={setTarget}/>
            </Card>
            {
                supportMlt ? <Card title="其它自变量序列" size="small" bordered={false}>
                    <DataSourceSelector mlt={true} dispatch={setDataSource}/>
                </Card> : null
            }
            <Card title="模型更新" size="small" bordered={false}>
                <BatchMetaForm mlt={false} dispatch={setModelUpdate}/>
                <Compute target={target[0]} meta={modelUpdate} independent={dataSource} process={dataProcessModel}
                         detect={detectModel}/>
            </Card>
            <Card title="异常检测" size="small" bordered={false}>
                <StreamMetaForm dispatch={setAnomalyDetect}/>
            </Card>
            <Card size="small" bordered={false} extra={
                <Button size="small" type="primary" onClick={submit} loading={loading}>提交</Button>
            }/>
        </div>
    );
};