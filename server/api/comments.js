const Express = require('express');

const mysql = require('mysql');
const dbConf = require('../configs/dbConf');

const commentsSQL = require('../configs/commentsSQL.js');
const responseClient = require('../util/util').responseClient;

const formatDate = require('../../src/js/func-es5.js').formatDate;
const router = Express.Router();
const pool = mysql.createPool(dbConf.mysql);


router.post('/addComment',(req,res)=>{
    let {articleId,replyTo,content,env,createTime,email,qq,nickName,belong} = req.body;

    pool.getConnection((err,connection)=>{
        connection.release();
        let checktourist = commentsSQL.checktourist;
        let chkTourist = new Promise(function(resolve,reject){
            connection.query(checktourist, [nickName], (Err, result) => {
                if (result) {
                    resolve(result)
                } else {
                    responseClient(res, 400, 2, 'faild', Err)
                }
            })

        })
        chkTourist.then(function(r){

            if(r.length == 0){

                return new Promise(function(resolve,reject){
                    let addtourist = commentsSQL.addtourist;
                    connection.query(addtourist, [nickName, qq, email], (Err, result) => {
                        if (result) {
                            result.newtourist = true;
                            resolve(result)
                        } else {
                            responseClient(res, 400, 2, 'faild', Err)
                        }
                    })
                })
                //insertId
            }else{

                let touristId = (r[0]||{}).id;
                return new Promise(function (resolve, reject) {
                    let addComment = commentsSQL.addComment;
                    connection.query(addComment, [articleId, touristId, replyTo, content, env, createTime, belong], (Err, result) => {
                        if (result) {
                            result.newtourist = false;
                            resolve(result)
                        } else {
                            responseClient(res, 400, 2, 'faild', Err)
                        }
                    })
                })
            }
        }).then((r)=>{

            if (r.newtourist === false){
                responseClient(res, 200, 1, 'success', {})
            }else{
                let touristId = r.insertId
                let addComment = commentsSQL.addComment;
                connection.query(addComment, [articleId, touristId, replyTo, content, env, createTime,belong], (Err, result) => {
                    if (result) {

                        responseClient(res, 200, 1, 'success', {})
                    } else {
                        console.log(Err);
                        responseClient(res, 400, 2, 'faild', Err)
                    }
                })
            }

        })
    })
})

router.all('/getArticleComment',(req,res)=>{
    let {articleId} = req.body;
    pool.getConnection((err,connection)=>{
        connection.release();
        let getComments = commentsSQL.getComments;
        let getMain = new Promise(function(resolve,reject){
            connection.query(getComments, [articleId],(Err,result)=>{
                if (result) {

                    //responseClient(res, 200, 1, 'success', result);

                    resolve(result)
                } else {

                    responseClient(res, 400, 2, 'faild', Err)
                }
            })
        })
        getMain.then((resp)=>{
            let getChildComments = commentsSQL.getChildComments;
            connection.query(getChildComments, [articleId], (Err, result) => {
                if (result) {

                    resp.forEach((e,i)=>{
                        e.replyList = [];
                        for(let i2=0;i2<result.length;i2++){
                            let e2 = result[i2];
                            if (e.id == e2.belong) {
                                e.replyList.push(e2);
                                result.splice(i2,1);
                                i2--;
                            }
                        }

                    })
                    responseClient(res, 200, 1, 'success', resp);


                } else {

                    responseClient(res, 400, 2, 'faild', Err)
                }
            })
        })
    })
})

module.exports = router;