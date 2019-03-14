import React, { Component } from 'react';
import { handleWrapperMove} from '../../js/func.js';
import { fetchGet,fetchPost} from '../../js/fetch';
import RecentArticleItem from '@/components/recentAtricleItem.jsx';
import { Button, Modal} from 'antd';
/*const updateViewport=function(){
    let data = Object.assign({
        top: window.pageYOffset,
        bottom: window.innerHeight + window.pageYOffset
    })
    if (!this.isLeave) {
        this.setState({
            viewPort: data
        })
    }
}*/
class HomePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            viewPort:{
                top: window.pageYOffset,
                bottom: window.innerHeight + window.pageYOffset
            },
            recentArticleList:[],
            topThreeArticles:[]
        }
        this.page = 0;
        this.isLeave = false;
        //this.updateViewPort = this.updateViewport.bind(this);

        this.viewMoreArticle = this.viewMoreArticle.bind(this)
    }
    updateViewport= ()=>{
        let data = Object.assign({
            top: window.pageYOffset,
            bottom: window.innerHeight + window.pageYOffset
        })
        if (!this.isLeave) {
            this.setState({
                viewPort: data
            })
        }
    }
    componentWillMount(){

        document.addEventListener('scroll', this.updateViewport, false);
        document.addEventListener('resize', this.updateViewport, false);

    }
    componentWillUnmount(){

        this.isLeave = true;
        document.removeEventListener('scroll', this.updateViewport, false);
        document.removeEventListener('resize', this.updateViewport, false);
    }
    componentDidMount(){

        fetchGet('/api/articles/getTopArticles').then((res)=>{
            const topThreeArticles = res.data;
            this.setState({ topThreeArticles})


        })
        fetchPost('/api/articles/getNormalArticles', { page: 0 }).then((res)=>{
            const recentArticleList = res.data;
            this.setState({ recentArticleList})

        })

        this.updateViewport()
    }
    viewMoreArticle(){
        this.page ++;

        fetchPost('/api/articles/getNormalArticles', { page: this.page }).then((res) => {
            if(res.data.length == 0){
                Modal.info({
                    title:'提示',
                    content:'加载完啦'
                })
            }else{
                let oldList = this.state.recentArticleList.concat()
                const recentArticleList = oldList.concat(res.data);
                this.setState({ recentArticleList })
                this.updateViewport()
            }
        })
    }
    goViewArticle(id){
        this.props.history.push(`/article/${id}`)
    }
    render(){
        const { recentArticleList, topThreeArticles} = this.state;
        let recnetList = recentArticleList.map((e,i)=>{
            return(
                <RecentArticleItem articleInfo={e} key={i + 1} viewPort={this.state.viewPort} viewFunc={this.goViewArticle.bind(this, e.id)}/>
            )
        })
        let topThreeList = topThreeArticles.map((e,i)=>{
            return (
                <div key={e.id} className="smallRadioCard" onMouseEnter={handleWrapperMove.bind(this, 'in', '.blackWrapper')} onMouseLeave={handleWrapperMove.bind(this, 'out', '.blackWrapper')} data-origin="1" onClick={this.goViewArticle.bind(this,e.id)}>
                    <div className="blackWrapper" style={{ top: '100%' }}>
                        <p className="coverTitle">
                            {e.title}
                                    </p>
                        <p className="coverDesc">
                            {e.article_desc}
                                    </p>
                    </div>
                    <img src={e.cover} alt="" className="underCover" />
                </div>
            )
        })
        return(
            <div>
                <div className="HomeBgImgBox">
                    <div className="centerInfo">
                        <div className="GreetingTitle" data-text="Hello,GuangDongRen♂">
                            Hello,GuangDongRen♂
                        </div>
                    </div>

                </div>
                <div className="HomeMainBox">
                    <div className="ToppestThreeBox HomeSecondBox">
                        <div className="articleTitle">
                            Kankore start
                        </div>
                        <div className="clearfix text-center mt_20 cardParent">
                            {topThreeList}
                        </div>
                    </div>
                    <div className="rencenArticelList">
                        <div className="articleTitle">
                            最近文章
                        </div>
                        <div className="HomeSecondBox">
                            {recnetList}
                        </div>
                        <div className="text-center ">
                            <Button type="default" className="mb_15" onClick={this.viewMoreArticle}>加载更多</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HomePage;