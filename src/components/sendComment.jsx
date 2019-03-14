import React,{Component} from 'react';
//import wEditor from 'wangeditor';
import {Button} from 'antd';
//import fetchJsonp from 'fetch-jsonp';
import { fetchPost } from '../js/fetch';

import { getSessionStore, formatDate} from '@/js/func.js';



class SendComment extends Component{
    constructor(props){
        super(props)
       // this.initEditor = this.initEditor.bind(this)
        //this.getQQInfo = this.getQQInfo.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidUpdate(){
        //this.initEditor()
        window.portraitCallBack = (data) => {
            console.log(data)
        }
    }
    handleSubmit(){
        let { touristEmail, touristQQ, touristName, commentArea} = this.refs;
        let articleId = this.props.params.articleId;
        let env = 'chrome';
        let createTime = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
        let content = commentArea.value;
        let replyTo = this.props.params.replyTo;
        let belong = this.props.params.belong
        fetchPost('/api/comments/addComment', { articleId, createTime, env, content, replyTo, nickName: touristName.value, qq: touristQQ.value, email: touristEmail.value, belong}).then(res=>{
           if(res.message == 'success' && this.props.refresh){
               this.props.refresh()
           }
        })
    }

    /*getQQInfo(event){

        fetchJsonp(`http://users.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=${event.target.value}`,{
            timeout:4000,
            jsonpCallbackFunction:'portraitCallBack'
        }).then((res)=>{
            return res.json();

        }).then(function (json) {
            console.log('parsed json', json); // 在此处进行接收数据之后的操作


        })
    }*/
    componentWillUnmount(){
        window.portraitCallBack = null;
    }
    render(){
        return(
            <div className="sendCommentContainer">
                <div className="text-center">
                    {this.props.sendType == 1 ? (<span>发布留言</span>) : (<div><span>回复留言</span><span className="float-right cursorP" onClick={this.props.close}>X</span></div>)}

                </div>
                <div className="commenterInfo space-between">
                    <div className="blockItem">
                        <span className="title">
                            昵称*：
                        </span>
                        <input type="text" ref="touristName" className="win10Style"/>
                    </div>
                    <div className="blockItem">
                        <span className="title">
                            qq号：
                        </span>
                        <input type="text" ref="touristQQ" className="win10Style" />
                    </div>
                    <div className="blockItem">
                        <span className="title">
                            邮箱：
                        </span>
                        <input type="text" ref="touristEmail" className="win10Style" />
                    </div>
                </div>
                <p className="space-between">发布评论
                    <Button type="primary" onClick={this.handleSubmit}>发布</Button>
                </p>
                <textarea className="postComment" ref="commentArea"></textarea>
            </div>
        )

    }
}

export default SendComment;