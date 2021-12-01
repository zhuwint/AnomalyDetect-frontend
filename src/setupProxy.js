const {createProxyMiddleware} = require("http-proxy-middleware")

module.exports = function (app) {
    app.use("/controller", createProxyMiddleware("/controller", {
        target: "http://10.203.96.205:3030",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
            "^/controller": "/api"
        }
    }))
}