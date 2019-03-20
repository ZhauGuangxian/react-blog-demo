import React, { Component } from 'react';
import { formatDate } from '@/js/func.js'
import SendComment from './sendComment.jsx'
class CommentBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCmt: false
        }

        this.cmtIdList = [];

        this.mainCmtId = this.props.comment.id;
    }
    getSnapshotBeforeUpdate() {

        let comment = this.props.comment;
        this.cmtIdList = [comment.id];

        if ((comment.replyList || []).length > 0) {
            comment.replyList.forEach((e, i) => {
                this.cmtIdList.push(e.id)
            })
        }
        return null;
    }
    render() {
        let comment = this.props.comment;
        let childComment = []
        //<span className="commentEnv">{comment.env}</span>
        if ((comment.replyList || []).length > 0) {

            childComment = comment.replyList.map((e2, i2) => {
                let replyObj = {};
                if (e2.replyTo == comment.id) {
                    replyObj = comment;
                } else {
                    replyObj = comment.replyList.filter((obj) => {
                        return obj.id == e2.replyTo
                    })[0]

                }
                return (
                    <div key={`${e2.id}-${i2}`}>
                        <div className="headLine">
                            <span className="touristName">{e2.touristName}<span className="huifuSpan">回复</span>{replyObj.touristName}</span>
                            <span className="commentTime">{formatDate(e2.createTime, 'yyyy-MM-dd hh:mm:ss')}</span>

                            <span onClick={() => {
                                this.setState({
                                    showCmt: true
                                })
                                this.props.reply(e2.id, this.mainCmtId)
                            }} className="cursorP">
                                回复
                        </span>
                        </div>
                        <div className="commentArea">
                            {e2.content}
                        </div>
                    </div>
                )

            })
        }

        return (
            <div className="pd_20 commentBlock">

                <div className="mainComment" key={comment.id}>
                    <div className="headLine">
                        <span className="touristName">{comment.touristName}</span>
                        <span className="commentTime">{formatDate(comment.createTime, 'yyyy-MM-dd hh:mm:ss')}</span>

                        <span onClick={() => {
                            this.setState({
                                showCmt: true
                            })
                            this.props.reply(comment.id, this.mainCmtId)
                        }} className="cursorP">
                            回复
                        </span>
                    </div>
                    <div className="commentArea">
                        {comment.content}
                    </div>
                    <div className="childComment">
                        {childComment}
                    </div>
                </div>
                {
                    this.cmtIdList.indexOf(this.props.currentCommentId) >= 0 && <SendComment params={this.props.params} sendType="2" close={this.props.close} refresh={this.props.refresh} />
                }
            </div>
        )
    }
}

export default CommentBlock;