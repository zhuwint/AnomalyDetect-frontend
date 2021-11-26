import { Carousel } from "antd";
import React from "react";
import bannerImage from '../../assets/login-banner.png'
import './style/index.css'

export default function LoginBanner() {
    const data = {
        slogan: '物联网监测数据分析预警系统',
        subSlogan: '基于dapr服务网格',
        image: bannerImage,
    };

    return (
        <Carousel className="carousel">
            <div key="1">
                <div className="carousel-item">
                    <div className="carousel-title">{data.slogan}</div>
                    <div className="carousel-sub-title">{data.subSlogan}</div>
                    <img alt="pig1" className="carousel-image" src={data.image} />
                </div>
            </div>
        </Carousel>
    )
}