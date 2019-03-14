const Express = require('express');
const dbConf = require('../configs/dbConf.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const responseClient = require('../util/util').responseClient;
const app = new Express();
const baseConf = require('../configs/index');
let fs = require('fs');
const path = require('path')
const multer = require('multer');
let upload = multer({
    dest:path.join( __dirname,'../../src/upload')
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'express_react_cookie',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1000 * 120 }//过期时间
}));
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", `http://${baseConf.apiHost}:${baseConf.apiPort}`)
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
})

var userRoute = require('./user.js');
app.use('/user', userRoute);
var articlesRoute = require('./articles.js');
app.use('/articles', articlesRoute);
var commentRoute = require('./comments.js')

app.use('/comments',commentRoute)
app.post('/fileUpload',upload.single('imageFile'),(req,res,next)=>{
    console.log(req.file)
    let type = req.file.originalname;
    type = type.split('.')[1];
    var newname = `http://${baseConf.apiHost}:${baseConf.port }/upload/${req.file.filename}.${type}`
    fs.rename(req.file.path, 'src/upload/' + req.file.filename + '.' + type,(err)=>{
        if(err){
            throw err;
        }
    })
    /*res.writeHead(200, {
        "Access-Control-Allow-Origin": "*"
    });*/

    //res.end(JSON.stringify(req.file) + JSON.stringify(req.body));
    responseClient(res, 200, 1, 'success', newname)
    //res.json(newname)
})
var port = baseConf.apiPort;
app.listen(port, function (err) {
    if (err) {
        console.error('err:', err);
    } else {
        console.info(`===> api server is running at ${baseConf.apiHost}:${baseConf.apiPort}`)
    }
});
//app.use('/user',require('./user'));
