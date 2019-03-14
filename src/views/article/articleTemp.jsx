import React,{Component} from 'react';
import {fetchPost} from '@/js/fetch.js';

import hljs from 'highlight.js';

import  SendComment from '../../components/sendComment.jsx';
import CommentBlock from '@/components/comments.jsx';
import tocbot from 'tocbot';
import 'tocbot/src/scss/_tocbot-core.scss';
import 'tocbot/src/scss/_tocbot-default-theme.scss';
const preventA = (e)=>{
    e.preventDefault();
}
class ArticleTemp extends Component{
    constructor(props){
        super(props);
        this.state={
            articleInfo:{
                content:'加载中'
            },
            commentList:[],
            isReply:false,
            belong:0,
            currentCommentId:0
        }
        this.sendReply = this.sendReply.bind(this);
        this.closeCmt = this.closeCmt.bind(this);
        this.refreshComment = this.refreshComment.bind(this);
    }

    componentWillMount(){
        /*marked.setOptions({

            highlight:  code => hljs.highlightAuto(code).value
        })
        */
    }
    sendReply(currentCommentId,belong){
        this.setState({
            isReply:true,
            belong,
            currentCommentId
        })

    }
    refreshComment(){
        const { id } = this.props.match.params;
        fetchPost('/api/comments/getArticleComment', { articleId: id }).then(res => {
            if (res.message === 'success') {
                let commentList = res.data;
                this.setState({
                    commentList
                })
            }
        })
    }
    closeCmt(){
        this.setState({
            isReply:false,
            currentCommentId:0
        })
    }
    componentDidMount(){

        const {id} = this.props.match.params;
        fetchPost('/api/articles/articleInfo',{id}).then(res=>{
            if(res.message=='success'){
                let articleInfo = res.data;

                this.setState({
                    articleInfo
                })
            }
        })
        fetchPost('/api/comments/getArticleComment',{articleId:id}).then(res=>{
            if(res.message === 'success'){
                let commentList = res.data;
                this.setState({
                    commentList
                })
            }
        })

     }
    render(){
        const { cover,title,article_desc,content,createDate,id } = this.state.articleInfo;
        let comments = this.state.commentList.map((e,i)=>{
            return(
                <CommentBlock comment={e} reply={this.sendReply} currentCommentId={this.state.currentCommentId} params={{ articleId: id, replyTo: this.state.currentCommentId,belong:this.state.belong }} key={e.id} close={this.closeCmt} refresh={this.refreshComment}/>
            )

        })

        return(
            <div className="mainContent">
                <div className="articleCover" style={{ 'backgroundImage': `url(${cover})`}}>
                    <div className="maskTitle">
                        <p className="articleTitle">{title}</p>
                        <p className="authorAndTime">
                            <span>发布于{createDate}</span>
                            <span>作者：GAIGAI</span>
                        </p>
                    </div>

                </div>
                <div className="articleSecondBox">
                    <div className="desc">{article_desc}</div>
                    <div className="content" ref={`contextArea`} dangerouslySetInnerHTML={{ __html: content }}></div>
                    <div className="toc-mulus">
                        <div className="mulus" onClick={preventA}></div>
                    </div>
                </div>
                <div className="commentCount">留言数{(comments || []).length}</div>
                {comments}
                {
                    this.state.isReply !== true ? <SendComment sendType="1" params={{ articleId: id, replyTo: 0,belong:0 }} close={this.closeCmt} refresh={this.refreshComment}/>:''
                }

            </div>
        )
    }
    componentDidUpdate(){

        let blocks = this.refs.contextArea.querySelectorAll('pre code');
        blocks.forEach((block) => {
            hljs.highlightBlock(block)
        })

        let hId = 0;
        let hhs = this.refs.contextArea.querySelectorAll('h1,h2,h3,h4,h5,h6');
        hhs.forEach((h) => {
            h.setAttribute('id', 'articleH' + hId++)
        })
        tocbot.init({
            // Where to render the table of contents.
            tocSelector: '.mulus', // 放置目录的容器
            // Where to grab the headings to build the table of contents.
            contentSelector: '.articleSecondBox', // 正文内容所在
            // Which headings to grab inside of the contentSelector element.
            headingSelector: 'h1, h2, h3, h4, h5', // 需要索引的标题级别
            positionFixedSelector: ".mulus", //目录位置固定

        });
    }
    componentWillUnmount(){
        tocbot.destroy();

    }
}

export default ArticleTemp;