import React from "react";
import {useSelector} from "react-redux";
import {ReducerState} from "../../redux";
import {Button, Card, Col, Row} from "antd";
import Title from "antd/es/typography/Title";
import {NavLink} from "react-router-dom"
import "./styles/index.css"

const Home: React.FC = () => {
    const user = useSelector((state: ReducerState) => state.global.userInfo)
    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card title={<Title>传感器页</Title>} className="item-center">
                        <Button type="primary">
                            <NavLink to="/sensor">点击跳转</NavLink>
                        </Button>
                    </Card>
                </Col>
                <Col span={8} >
                    <Card title={<Title>任务页</Title>} className="item-center">
                        <Button type="primary">
                            <NavLink to="/task">点击跳转</NavLink>
                        </Button>
                    </Card>
                </Col>
                <Col span={8} >
                    <Card title={<Title>日志页</Title>} className="item-center">
                        <Button type="primary">
                            <NavLink to="/record">点击跳转</NavLink>
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};


export default Home;