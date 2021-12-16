import React, {useEffect, useState} from "react";
import {Button} from "antd";
import {useHistory} from "react-router-dom";
import {useQuery} from "../../../utils/useQuery";
import {LeftOutlined} from "@ant-design/icons";
import {StreamTaskForm} from "./streamtaskform";
import {BatchTaskForm} from "./batchtaskform";

export const CreateTask: React.FC = () => {
    const history = useHistory();
    const query = useQuery();
    const [isStream, setIsStream] = useState<boolean>(false);

    useEffect(() => {
        switch (query.get("type")) {
            case "stream":
                setIsStream(true);
                break;
            case "batch":
                setIsStream(false);
                break;
            default:       // 默认创建 批处理任务
                setIsStream(false);
        }
    }, []);

    return (
        <div>
            <Button type="link" icon={<LeftOutlined/>} onClick={() => history.goBack()}>返回</Button>
            <br/>
            {
                isStream ? <StreamTaskForm/> : <BatchTaskForm/>
            }
        </div>
    );
};