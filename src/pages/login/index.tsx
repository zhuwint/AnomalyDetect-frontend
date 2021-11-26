import React from "react";
import "./style/index.css";
import LoginBanner from "./banner";
import LoginForm from "./form";

const Login: React.FC = () => {
    return (
        <div className="container">
            <div className="banner">
                <div className="banner-inner">
                    <LoginBanner/>
                </div>
            </div>
            <div className="content">
                <div className="content-inner">
                    <LoginForm/>
                </div>
            </div>
        </div>
    )
}

export default Login