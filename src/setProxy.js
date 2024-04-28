const { createProxyMiddleware } = require("http-proxy-middleware");
const { TARGET_URL } = require("./util/url.js");

module.exports = function (app) {
    app.use(
        createProxyMiddleware("*", {
            target: `${TARGET_URL()}`,
            changeOrigin: true,
        })
    );
};