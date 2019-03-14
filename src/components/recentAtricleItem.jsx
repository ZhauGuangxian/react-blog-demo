import React, { Component} from 'react';

class RecentArticleItem extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
        this.isLoaded = false;
        this.shouldLoad = false;
        this.updatePosition = this.updatePosition.bind(this);
    }
    updatePosition(topt, height){
        let {top,bottom} = this.props.viewPort;

        let articleArea = topt+height;
        if(articleArea >= top && articleArea <= bottom+220){
            this.shouldLoad = true

        }
    }
    componentDidUpdate(prevProps){

        if (!this.isLoaded && prevProps.viewPort){
            let el = this.refs.articleItem;
            //let rect = el.getBoundingClientRect()
            this.updatePosition(el.offsetTop, el.offsetHeight);
        }

    }
    render(){
        let e = this.props.articleInfo;
        let articleCreate = new Date(e.createTime);
        let now = new Date();
        let age = Math.floor((now - articleCreate)/3600/1000);
        if(age < 24){
            e.age = age+'小时';
        }else{
            e.age = Math.floor(age/24) + '天'
        }
        let shouldLoad = false;
        if(!this.isLoaded && this.shouldLoad){
            shouldLoad = true;
        }
        return(
            <div className={'recentArticleContent ' + (shouldLoad?'goLoad':'noLoad')} ref="articleItem" onClick={this.props.viewFunc}>
                <div className="picCover">
                    <img src={shouldLoad?e.cover:''} alt={e.title + '封面'} />
                </div>
                <div className="textPreview">
                    <p className="pushTime">发布于{e.age}前</p>
                    <p className="title">{e.title}</p>
                    <p className="desc">{e.article_desc}</p>
                </div>
            </div>
        )
    }

}
export default RecentArticleItem;