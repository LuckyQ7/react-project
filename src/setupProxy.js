const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://118.31.171.119:5000',
            changeOrigin: true,
        })
    );
};