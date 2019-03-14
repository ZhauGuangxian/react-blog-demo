/*import Express from 'express';

import mysql from 'mysql';
import dbConf from '../configs/dbConf';
import userSql from '../configs/userSQL';

import { responseClient} from '../util/util';*/

const Express = require('express');
const mysql = require('mysql');
const dbConf = require('../configs/dbConf');
const userSql = require('../configs/userSQL');

const responseClient = require('../util/util').responseClient;
const router = Express.Router();
const connection = mysql.createConnection(dbConf.mysql);

router.get('/getuserlist',(req,res)=>{
    let sqlLang = userSql.getUserList;
    connection.query(sqlLang,function(err,result){
        if(result){

            responseClient(res, 200, 1, 'success', result)
        }else{
            responseClient(res, 400, 2, 'failed', result)
        }
        console.log('connected')

        //connection.end();
    })
})

router.post('/login',(req,res)=>{


    let {username,password} = req.body;
    if(!username){
        responseClient(res,400,2,'用户名不可为空')

    }

    if(!password){
        responseClient(res,400,2,'密码不能为空')
    }

    let sqlLang = userSql.matchUser

    connection.query(sqlLang, [username, password],function(err,result){

        if(result){
            let userInfo = result[0];
           /* let data = {};
            data.userId = userInfo.id;
            data.userName = userInfo.username;*/
            delete userInfo.password;
            req.session.userInfo = userInfo;
            responseClient(res, 200, 1, 'success', userInfo)
        } else {
            responseClient(res, 400, 2, 'failed', result)
        }
        //connection.end()
    })
})

router.get('/userInfo', function (req, res) {
    if (req.session.userInfo) {
        responseClient(res, 200, 200, 'success', req.session.userInfo)
    } else {
        responseClient(res, 200, 1, '请重新登录', req.session.userInfo)
    }
});

router.get('/exit',function(req,res){
    delete req.session.userInfo;

    responseClient(res, 200, 1, '已退出登录', req.session.userInfo)
})

module.exports = router;