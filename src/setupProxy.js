const proxy = require('http-proxy-middleware');

const proxyApi = `https://server.cruiser.gr:8443/`;
module.exports = function(app) {
  app.use(proxy('/Appoploo2', { target: proxyApi, changeOrigin: true }));
};
