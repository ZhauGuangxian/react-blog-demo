const Express = require('express');

const mysql = require('mysql');
const dbConf = require('../configs/dbConf');

const articlesSQL = require('../configs/articlesSQL');
const responseClient = require('../util/util').responseClient;
const check = require('../util/util').check;
//import { responseClient, check } from '../util/util';
//import { formatDate } from '../../src/js/func.js';
const formatDate = require('../../src/js/func-es5.js').formatDate;
const router = Express.Router();
const pool = mysql.createPool(dbConf.mysql);

router.all('/getTopArticles',(req,res)=>{
    let sqlLang = articlesSQL.getTopArticlesList;
    pool.getConnection((err, connection) => {
        connection.query(sqlLang, function (err, result) {
            connection.release();
            if (result) {
                if (result instanceof Array && result.length > 0) {

                    result.forEach((e, i) => {
                        e.createDate = formatDate(e.createTime,'yyyy-MM-dd');
                        e.updateDate = formatDate(e.updateTime, 'yyyy-MM-dd');

                    }
                    )
                }
                responseClient(res, 200, 1, 'success', result)
            } else {
                responseClient(res, 400, 2, 'failed', result)
            }

        })
    })
})
router.all('/getAllArticles', (req, res) => {
    let { start, pageSize } = req.body;
    if (!start || !pageSize) {
        responseClient(res, 400, 2, '参数错误')
    }
    pageSize = parseInt(pageSize);
    start = (start - 1) * pageSize;
    let sqlLang = articlesSQL.getArticlesByPage;
    pool.getConnection((err, connection) => {

        connection.query(sqlLang, [start, pageSize], function (err, result) {
            connection.release();
            if (result) {
                let data={};
                let list = result[1];
                let count = result[0][0]['COUNT(*)'];
                /*if (result instanceof Array && result.length > 0) {
                    result.forEach((e, i) => {
                        e.createDate = e.createTime.toString().replace('T', ' ').replace('.000Z', '');
                        e.updateDate = e.updateTime.toString().replace('T', ' ').replace('.000Z', '');
                    }
                    )
                }*/
                list.forEach((e, i) => {
                    e.createDate = formatDate(e.createTime, 'yyyy-MM-dd');
                    e.updateDate = formatDate(e.updateTime, 'yyyy-MM-dd');
                })
                data.articlesList = list;
                data.total = count;
                responseClient(res, 200, 1, 'success', data)
            } else {
                console.log(err)
                responseClient(res, 400, 2, 'failed', result)
            }

        })
    })
})
router.all('/getNormalArticles', (req, res) => {
    let sqlLang = articlesSQL.getNormalArticlesList;
    let {page} = req.body;
    page = parseInt(page) * 10;
    if(typeof page == 'undefined'){
        responseClient(res, 200, 0, 'failed', '参数错误');
        return;
    }

    pool.getConnection((err, connection) => {
        connection.release();
        connection.query(sqlLang,[page], function (Err, result) {
            console.log(Err)
            if (result) {

                if (result instanceof Array && result.length > 0) {
                    result.forEach((e, i) => {
                        e.createDate = formatDate(e.createTime, 'yyyy-MM-dd');
                        e.updateDate = formatDate(e.updateTime, 'yyyy-MM-dd');
                    }
                    )
                }
                responseClient(res, 200, 1, 'success', result)
            } else {
                responseClient(res, 400, 2, 'failed', result)
            }
        })
    })
})
router.post('/addArticle',(req,res)=>{
    if(!check(req,res)){
        responseClient(res, 400, 2, '请先登录')
        return;
    }else{

        pool.getConnection((err,connection)=>{
            connection.release();
            let sqlLang = articlesSQL.addNewArticle
            let { title, cover, content, article_desc, top_flag = 99, createTime} = req.body;
            if(top_flag == 0){
                sqlLang = articlesSQL.updateTopOther + ';' + articlesSQL.addNewArticle;
            }
            let updateTime = createTime;
            if(!title || !content){
                responseClient(res, 400, 2, '请输入文章标题和正文')
            }
            connection.query(sqlLang, [title, cover, content, article_desc, top_flag, createTime, updateTime],(Error,result)=>{
                if(result){

                    responseClient(res, 200, 1, 'success', result)
                }else{
                    responseClient(res, 400, 2, 'failed', Error)
                }
            })
        })
    }
})

router.post('/deleteArticle',(req,res)=>{

    if (!check(req, res)) {
        responseClient(res, 400, 2, '请先登录')

    }else{

        let sqlLang = articlesSQL.deleteArticle;
        pool.getConnection((err,connection)=>{
            connection.release();
            let {id} = req.body
            connection.query(sqlLang,[id],(Error,result)=>{
                if(result){
                    responseClient(res, 200, 1, 'success', result)
                }else{
                    responseClient(res, 400, 2, 'failed', result)
                }
            })
        })
    }
})

router.all('/articleInfo',(req,res)=>{
    let sqlLang = articlesSQL.articleInfo;
    pool.getConnection((err,connection)=>{
        connection.release();
        let {id} = req.body;
        var host = req.headers.host, ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log("client ip:" + ip + ", host:" + host);
        if(!id){
            responseClient(res, 400, 2, 'failed', '入参错误')
        }else{
            connection.query(sqlLang,[id],(Error,result)=>{

                if(result){
                    result = (result[0] || {})
                    result.createDate = formatDate(result.createTime, 'yyyy-MM-dd');
                    result.updateDate = formatDate(result.updateTime, 'yyyy-MM-dd');

                    responseClient(res, 200, 1, 'success', result)
                }
            })
        }
    })
})
/*const connection = mysql.createConnection(dbConf.mysql);

router.get('/getTopArticles', (req, res) => {
    let sqlLang = articlesSQL.getTopArticlesList;
    connection.query(sqlLang, function (err, result) {
        if (result) {
            if(result instanceof Array && result.length > 0){

                result.forEach((e,i)=>{
                    e.createDate = e.createTime.toString().replace('T', ' ').replace('.000Z', '');
                    e.updateDate = e.updateTime.toString().replace('T', ' ').replace('.000Z', '');

                }
                )
            }
            responseClient(res, 200, 1, 'success', result)
        } else {
            responseClient(res, 400, 2, 'failed', result)
        }



    })
})
router.all('/getAllArticles',(req,res)=>{
    let { start,pageSize } = req.body;
    if (!start || !pageSize){
        responseClient(res, 400, 2, '参数错误')
    }
    pageSize = parseInt(pageSize);
    start = (start - 1) * pageSize;
    let sqlLang =  articlesSQL.getArticlesByPage;

    connection.query(sqlLang, [start, pageSize], function (err, result) {

        if (result) {
            if (result instanceof Array && result.length > 0) {
                result.forEach((e, i) => {
                    e.createDate = e.createTime.toString().replace('T', ' ').replace('.000Z', '');
                    e.updateDate = e.updateTime.toString().replace('T', ' ').replace('.000Z', '');
                }
                )
            }
            responseClient(res, 200, 1, 'success', result)
        } else {
            console.log(err)
            responseClient(res, 400, 2, 'failed', result)
        }



    })
})
router.get('/getNormalArticles',(req,res)=>{
    let sqlLang = articlesSQL.getNormalArticlesList;
    connection.query(sqlLang, function (err, result) {
        if (result) {
            if (result instanceof Array && result.length > 0) {
                result.forEach((e, i) => {
                    e.createDate = e.createTime.toString().replace('T', ' ').replace('.000Z', '');
                    e.updateDate = e.updateTime.toString().replace('T', ' ').replace('.000Z', '');
                }
                )
            }
            responseClient(res, 200, 1, 'success', result)
        } else {
            responseClient(res, 400, 2, 'failed', result)
        }



    })
})
*/
module.exports = router;