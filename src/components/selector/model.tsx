import React, {useEffect, useState} from "react";
import {
    FetchModel,
    FetchModelParams,
    Model,
    ModelMeta,
    ModelParamValidate,
    ModelService,
} from "../../services/service_model";
import {Alert, Button, Col, Form, Input, InputNumber, message, Row, Select, Switch} from "antd";
import "./styles/index.css";

interface IProps {
    type: "stream" | "batch" | "process";
    dispatch?: (data: ModelService) => void;
    initModelService?: ModelService;
    editable?: boolean;
    setMlt?: (data: boolean) => void;
}


export const ModelSelector: React.FC<IProps> = (props) => {
    const [models, setModels] = useState<ModelMeta[]>([]);
    const [error, setError] = useState<string>("");
    const [name, setName] = useState<string>("");   // 当前选中的模型
    const [currentModel, setCurrentModel] = useState<Model>({params: {}, description: "", support_mlt: false});
    const [changed, setChanged] = useState<boolean>(false);

    const [paramsForm] = Form.useForm();

    useEffect(() => {
        FetchModel(props.type).then(res => {
            if (res.status === 0) {
                setModels(res.data);
            } else {
                setError(res.msg);
            }
        }).catch(() => setError("获取模型失败"));
    }, [props]);


    const onModelChanged = (value: string) => {
        setName(value);
        FetchModelParams(value).then(res => {
            if (res.status === 0) {
                setCurrentModel(res.data);
                const p: { [key: string]: string[] | string | number | boolean } = {};
                Object.keys(res.data.params).map((item, key) => {
                    if (res.data.params.hasOwnProperty(item)) {
                        let v = res.data.params[item];
                        if (typeof v === "object") {
                            if (v.length > 0) {
                                p[item] = v[0];
                            }
                        } else {
                            p[item] = v;
                        }
                    }
                });
                paramsForm.setFieldsValue(p);
                if (props.dispatch) {
                    props.dispatch({
                        name: value,
                        params: p,
                    });
                }
                if (props.setMlt) {
                    props.setMlt(res.data.support_mlt);    // 设置是否支持多变量时间序列
                }
                setChanged(false);
            } else {
                setError(res.msg);
            }
        }).catch(() => setError("获取失败"));
    };

    const submit = () => {
        const params = paramsForm.getFieldsValue();
        setError("");
        ModelParamValidate(name, params).then(res => {
            if (res.status === 0) {
                message.success("模型参数验证通过", 1);
                setChanged(false);
                if (props.dispatch) {
                    props.dispatch({
                        name: name,
                        params: paramsForm.getFieldsValue(),
                    });
                }
                setError("");
            } else {
                setError(res.msg);
            }
        }).catch(() => setError("无法连接到模型"));
    };

    return (
        <div>
            <Row>
                <Col span={6}>
                    <Select placeholder="模型选择" onChange={onModelChanged} className="my-selector" bordered={false}
                            size="small" disabled={models.length === 0}>
                        {
                            models.map((item, index) => {
                                return <Select.Option value={item.name}
                                                      key={index.toString()}>{item.name}</Select.Option>;
                            })
                        }
                    </Select>
                </Col>
                <Col span={12} offset={1}>
                    {
                        currentModel.description !== "" ?
                            <Alert style={{whiteSpace: "pre-wrap"}} message={currentModel.description} showIcon={true}
                                   type="info"/> : null
                    }
                    {
                        error !== "" ? <Alert message={error} type="error" showIcon={true}/> : null
                    }
                </Col>
            </Row>
            <br/>
            <Row>
                <Form form={paramsForm} layout="inline" onChange={() => setChanged(true)}>
                    {
                        Object.keys(currentModel.params).map((item, key) => {
                            if (currentModel.params.hasOwnProperty(item)) {
                                return <Form.Item label={item} name={item} key={key.toString()}>
                                    {
                                        renderFormItem(currentModel.params[item])
                                    }
                                </Form.Item>;
                            }
                        })
                    }
                    <Form.Item>
                        <Button disabled={!changed} size="small" type="primary" htmlType="submit" block
                                onClick={submit}>验证</Button>
                    </Form.Item>
                </Form>
            </Row>
        </div>
    );
};

const renderFormItem = (value: number | string[] | boolean | string) => {
    switch (typeof value) {
        case "number":
            return <InputNumber size="small"/>;
        case "string":
            return <Input size="small"/>;
        case "boolean":
            return <Switch size="small"/>;
        case "object":      // 数组
            return (
                <Select defaultValue={value.length > 0 ? value[0] : ""} size="small" style={{width: "150px"}}>
                    {
                        value.map((item, index) => {
                            return (
                                <Select.Option value={item} key={index}>{item}</Select.Option>
                            );
                        })
                    }
                </Select>
            );
    }
};