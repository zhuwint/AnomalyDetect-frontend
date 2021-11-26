import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ReducerState} from "../../redux";
import {Avatar, Button, Dropdown, Layout, Menu, message, Modal, Table} from "antd";
import {UserOutlined} from "@ant-design/icons";
import Text from "antd/es/typography/Text";
import history from "../../history";
import {Link} from "react-router-dom";
import "../style/index.css";
import {GetProjectInfo, StoreProjectInfo, UserLogout} from "../../utils/useStorage";
import {ProjectInfo} from "../../redux/global";
import {FetchProjects, ProjectIdName} from "../../services/service_controller";


const {Header} = Layout;

interface Row extends ProjectIdName {
    key: string;
}

export const LayoutHeader: React.FC = () => {
    const user = useSelector((state: ReducerState) => state.global.userInfo);
    const project = useSelector((state: ReducerState) => state.global.project);
    const dispatch = useDispatch();
    const [idName, setIdName] = useState<ProjectIdName[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    useEffect(() => {
        FetchProjects().then(res => {
            if (res.status === 0) {
                setIdName(res.data);
            } else {
                message.error(res.msg).then(() => {
                });
            }
        }).catch(() => {
            message.error("服务器错误", 2).then(() => {
            });
        });
        const oldProject = GetProjectInfo();
        dispatch({
            type: "update-project",
            payload: {
                project: oldProject,
            },
        });
    }, []);

    const logout = () => {
        UserLogout();
        window.location.href = history.createHref({pathname: "/"});
    };

    const switchProject = () => {
        setIsModalVisible(true);
    };

    const onSwitchOk = (project: ProjectIdName) => {
        const data: ProjectInfo = {
            id: project.project_id,
            name: project.project_name,
        };
        dispatch({
            type: "update-project",
            payload: {
                project: data,
            },
        });
        // 存储到cookie中，刷新时不消失
        StoreProjectInfo(data);
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: "项目名称",
            dataIndex: "project_name",
        },
        {
            title: "操作",
            dataIndex: "op",
            render: (text: any, record: ProjectIdName) => <Button onClick={() => onSwitchOk(record)}>切换</Button>,
        },
    ];

    const userMenu = (
        <Menu style={{width: "100px"}}>
            <Menu.Item key={0}>
                <Link to={{pathname: "/user"}}>个人中心</Link>
            </Menu.Item>
            <Menu.Item key={1}>
                <Button type="link" onClick={logout}>退出登录</Button>
            </Menu.Item>
        </Menu>
    );


    let _idName: Row[] = [];
    idName.forEach((item, index) => {
        _idName.push(Object.assign({}, item, {"key": index.toString()}));
    });

    return (
        <div>
            <Modal title="项目切换" visible={isModalVisible} footer={null} onCancel={() => setIsModalVisible(false)}>
                <Table size="small" dataSource={_idName} columns={columns}
                       pagination={{position: ["bottomCenter"], pageSize: 10}}
                       showHeader={false}/>
            </Modal>
            <div className="right">
                <div className="space-layout">
                    <Button onClick={switchProject} type="dashed">
                        {project === undefined || project.id === -1 ? "请选择项目" : project.name}
                    </Button>
                </div>
                <div className="space-layout">
                    <Dropdown overlay={userMenu} className="my-dropdown">
                        <div className="item">
                            <Avatar style={{backgroundColor: "#87d068"}} className="sub-item" size="small"
                                    icon={<UserOutlined/>}/>
                            <Text className="sub-item">{user !== undefined ? user.username : "未登录"}</Text>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
};
