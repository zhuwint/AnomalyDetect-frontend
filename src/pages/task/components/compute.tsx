import React, {useState} from "react";
import {Alert, Button, message, Space} from "antd";
import {ModelService} from "../../../services/service_model";
import {BatchMeta, ComputeReq, ComputeResp, ThresholdCompute, UnvariedSeries} from "../../../services/service_task";
import {useSelector} from "react-redux";
import {ReducerState} from "../../../redux";

interface IProps {
    process?: ModelService;
    detect?: ModelService;
    target: UnvariedSeries;
    independent?: UnvariedSeries[];
    meta?: BatchMeta;
}

export const Compute: React.FC<IProps> = (props) => {
    const project = useSelector((state: ReducerState) => state.global.project);
    const [resp, setResp] = useState<ComputeResp>();
    const [loading, setLoading] = useState<boolean>(false);

    const computeThreshold = () => {
        if (project && props.meta) {
            if (props.detect === undefined) {
                message.error("请先选择检测模型", 2);
                return;
            }
            const data: ComputeReq = {
                project_id: project.id,
                preprocess: props.process ? props.process : null,
                detect_model: props.detect,
                target: props.target,
                independent: props.independent ? props.independent : [],
                model_update: props.meta,
            };
            setLoading(true);
            ThresholdCompute(data).then(res => {
                if (res.status === 0) {
                    setResp(res.data);
                } else {
                    message.error(res.msg);
                }
                setLoading(false);
            }).catch(() => {
                message.error("无法连接服务器", 2);
                setLoading(false);
            });
        } else {
            message.error("请先选择项目", 2);
        }
    };


    return (
        <Space align="center">
            <Button type="primary" size="small" onClick={computeThreshold} loading={loading}>计算</Button>
            {
                resp === undefined ? null : (
                    !resp.success ? <Alert type="error" message={"计算失败:" + resp.error}/> :
                        <Alert type="success" message={`阈值下限:${resp.threshold_lower} 阈值上限:${resp.threshold_upper}`}/>
                )
            }
        </Space>
    );
};