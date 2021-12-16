import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Form, Input, message, Modal, Popconfirm, Table, Tag} from "antd";
import {FetchModel, ModelMeta, RegisterModel, UnregisterModel} from "../../../services/service_model";
import {QuestionCircleOutlined} from "@ant-design/icons";


interface IProps {
    title: string
    modelType: "stream" | "batch" | "process";
}


export const ModelList: React.FC<IProps> = (props) => {
    const [models, setModels] = useState<ModelMeta[]>([]);
    const [error, setError] = useState<string>("");
    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, [props]);


    const fetchData = () => {
        setError("");
        setLoading(true);
        FetchModel(props.modelType).then(res => {
            if (res.status === 0) {
                setModels(res.data);
            } else {
                setError(res.msg);
            }
            setLoading(false);
        }).then(res => {
            setError("获取失败");
            setLoading(false);
        });
    };

    const deleteModel = (name: string) => {
        UnregisterModel(name).then(res => {
            if (res.status === 0) {
                message.success("操作成功", 1);
                fetchData();
            } else {
                message.error("操作失败", 2);
            }
        }).catch(res => {
            message.error("无法连接服务器", 2);
        });
    };


    const columns = [
        {
            title: "模型名称",
            key: "name",
            dataIndex: "name",
        },
        {
            title: "地址",
            key: "url",
            dataIndex: "url",
        },
        {
            title: "状态",
            key: "health",
            dataIndex: "health",
            render: (text: string, row: ModelMeta) => (
                <Tag color={row.health ? "#87d068" : "#f50"}>{row.health ? "健康" : "无法连接"}</Tag>
            ),
        },
        {
            title: "操作",
            key: "op",
            render: (text: string, row: ModelMeta) => (
                <>
                    <Button type="link" size="small">编辑</Button>
                    <Popconfirm title="确定要删除该模型吗?" icon={<QuestionCircleOutlined style={{color: "red"}}/>}
                                placement="topLeft" onConfirm={() => deleteModel(row.name)}>
                        <Button type="link" size="small">删除</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];


    const create = () => {
        form.resetFields();
        setVisible(true);
    };

    const ok = () => {
        form.validateFields().then(values => {
            const name = values.name;
            const url = values.url;
            RegisterModel(name, url, props.modelType).then(res => {
                if (res.status === 0) {
                    message.success("模型注册成功", 1);
                } else {
                    message.error("模型注册失败", 2);
                }
                setVisible(false);
                fetchData();
            }).catch(() => {
                setVisible(false);
            });
        }).catch(() => {
            setVisible(false);
        });
    };

    return (
        <>
            <Modal title="告警模型" visible={visible} onOk={ok} onCancel={() => setVisible(false)}>
                <Form form={form}>
                    <Form.Item name="name" label="模型名称" rules={[{required: true, message: "请输入模型名称"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="url" label="模型地址" rules={[{required: true, message: "请输入模型地址"}]}>
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
            <Card title={props.title} bordered={false} size="small"
                  extra={<Button size="small" type="primary" onClick={create}>创建/修改</Button>}>
                <Table loading={loading} pagination={false} columns={columns} dataSource={models} size="small"/>
            </Card>
        </>
    );
};