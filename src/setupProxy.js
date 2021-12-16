const {createProxyMiddleware} = require("http-proxy-middleware")

module.exports = function (app) {
    app.use("/controller", createProxyMiddleware("/controller", {
        target: "http://localhost:3030",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
            "^/controller": "/api"
        }
    }))
}