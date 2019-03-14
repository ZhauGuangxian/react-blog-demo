import React, { Component } from 'react';
import {  Route, Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import {fetchGet} from './js/fetch.js';
import {Icon} from 'antd';
import { setSessionStore,getSessionStore} from './js/func.js'
const Loading = ()=>{
    return(<div>加载中......</div>)
}
const netConf = require('./js/conf')
let {host,port} = netConf;
import Footer from './components/footer.jsx'
const HomePage = Loadable({
    loader:()=>import('./views/home/home'),
    loading: Loading
})
const ArticleTemp = Loadable({
    loader: () => import('./views/article/articleTemp'),
    loading: Loading
})
//import ArticleTemp from './views/article/articleTemp';
import '@/assets/style/main.less';
import '@/assets/live2d/js/live2d.js';
import '@/assets/live2d/css/live2d.css';

import '@/assets/live2d/js/message.js';
import { showHitokoto } from '@/assets/live2d/js/message.js';



class App extends Component {

    componentDidMount() {
        window.loadlive2d("live2d", `http://${host}:${port}/static/live2d/model/tia/model.json`);
        window.setInterval(showHitokoto, 30000);
        if (!getSessionStore('emojiList')){
            fetchGet('./static/mock/emoji.json').then(res=>{
                if(res.length >0){
                    let emojiList = res.map((e,i)=>{
                         let item = {
                            'alt': e.phrase,
                            'src':e.url
                         }
                         return item;
                    })
                    setSessionStore('emojiList', emojiList)
                }
            })
        }
    }
     /*{this.props.children}*/
    render() {
        const { url } = this.props.match;
        return (

                <div>
                    <header className="generalHeader">
                        <div className="blogTitle">
                            Gaigai
                        </div>
                        <ul className="quickEntreies">
                            <li>
                                <Link to="/home" className="noUnderLine top_nav"><Icon type="home" />首页</Link>
                            </li>
                            <li>
                                <Link to="/albumn" className="noUnderLine top_nav"><Icon type="picture" />相册</Link>
                            </li>
                            <li>
                                <Link to="/classifys" className="noUnderLine top_nav"><Icon type="bars" />文章分类</Link>
                            </li>
                        </ul>
                        <div className="yuliu"></div>
                    </header>
                    <div>

                        <Route path={url} exact component={HomePage} />
                        <Route path="/home" component={HomePage} />
                        <Route path="/albumn" component={ArticleTemp} />
                        <Route path="/classifys" component={ArticleTemp} />
                        <Route path="/article/:id" component={ArticleTemp} />
                    </div>
                    <div id="landlord">
                        <div className="message" style={{ opacity: 0 }}></div>
                        <canvas id="live2d" width="280" height="250" className="live2d"></canvas>

                    </div>
                    <Footer></Footer>
                </div>



        );
    }
}

export default App;
