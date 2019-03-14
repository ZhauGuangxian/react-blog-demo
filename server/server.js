

const path = require('path');
const Express = require('express');

const httpProxy = require('http-proxy');
const compression = require('compression');
const connectHistoryApiFallback = require('connect-history-api-fallback');

const baseConf = require('./configs/index');
const pkg = require('../package.json')

console.log(process.env.NODE_ENV);
const app = new Express();
app.use('/api',(req,res)=>{

    /**
     *
     * headers: {
        'x-forward-ip': req.ip.match(/([\w\.]+)/g)[1]
    }
    */


    proxy.web(req,res,{target:targetUrl})
})
const targetUrl = `http://${baseConf.apiHost}:${baseConf.apiPort}`;
//http://120.76.40.19:8080/pbc-app'
const proxy = httpProxy.createProxyServer({
    target: targetUrl, changeOrigin: true
});

proxy.on('proxyReq',function(proxyReq,req,res,options){

   proxyReq.setHeader('x-forwarded-for', req.ip);
})
app.use('/', connectHistoryApiFallback());
//app.use('/', Express.static(path.join(__dirname, "..", "dist.v" + pkg.version)));
app.use('/', Express.static(path.join(__dirname, "..", "dist.v" + pkg.version+"/static")));
app.use('/upload', Express.static(path.join(__dirname, "..", "src/upload")));
const router = Express.Router();

app.use('/usee', router);

app.use(compression());

//热更新
if (process.env.NODE_ENV !== 'production') {
    const Webpack = require('webpack');
    const WebpackDevMiddleware = require('webpack-dev-middleware');
    const WebpackHotMiddleware = require('webpack-hot-middleware');
    const webpackConfig = require('../bin/webpack.dev.config.js');

    const compiler = Webpack(webpackConfig);

    app.use(WebpackDevMiddleware(compiler, {
        publicPath: '/',
        stats: { colors: true },
        lazy: false
    }));
    app.use(WebpackHotMiddleware(compiler));
}

var port = baseConf.port;
app.listen(port,(err)=>{
    if(err){
        console.error(err)
    }else{
        console.log(`===>open http://${baseConf.host}:${baseConf.port} in a browser to view the app`)
    }
})