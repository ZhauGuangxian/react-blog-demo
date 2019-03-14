import React,{Component} from 'react';
import {  Route, Link, Switch} from 'react-router-dom';
import { fetchGet, fetchPost} from '../../js/fetch.js';
import Loadable from 'react-loadable';
const Loading = () => {
    return (<div>加载中......</div>)
}
const ArticleList = Loadable({
    loader: () => import('./articlesList.jsx'),
    loading: Loading
})
import '../../assets/style/manage.less';
const LoginRoute = Loadable({
    loader: () => import('./loginRoute.jsx'),
    loading: Loading
})
const AddArticle = Loadable({
    loader: () => import('./addArticle.jsx'),
    loading: Loading
})
const UpdateArticle = Loadable({
    loader: () => import('./updateArticle.jsx'),
    loading: Loading
})
import {Icon} from 'antd';
import {getSessionStore,removeSessionStore} from '../../js/func.js';

/*import {Provider} from 'react-redux';
import store from './adminredux';*/

//const store = createStore(adminReducer);

/*store.subscribe(()=>{
    console.log(store.getState(),'home')
})*/

class ManageHome extends Component{
    constructor(props){
        super(props);

        this.state = {
            empInfo:{},
            openUserSet:false,
            loginStateGet:false
        }
        this.handleUserSetting = this.handleUserSetting.bind(this);
        this.handleExit = this.handleExit.bind(this);

    }
    handleUserSetting(){
        let flag = this.state.openUserSet;
        this.setState({
            openUserSet: !flag
        })

    }
    handleExit(){
        let {url} = this.props.match;
        fetchGet('/api/user/exit').then(res=>{


            if (res.message == '已退出登录'){
                removeSessionStore('userInfo');
                this.setState({
                    loginStateGet: false
                })
                this.props.history.replace(`${url}/login`);
            }


        })
    }
    componentDidMount(){
        let userInfo = getSessionStore('userInfo')
        console.log(userInfo);
        let { url } = this.props.match;

        if (userInfo){
            this.state.empInfo = userInfo;
            this.state.loginStateGet = true;
            this.setState({});
        }else{
            this.props.history.replace(`${url}/login`)
        }
            /*fetchGet('/api/user/userInfo').then(res => {
                if (res.code != 200 && !res.data.id) {
                    this.props.history.replace(`${url}/login`)

                }else{
                    this.state.empInfo = res.data;
                    this.state.loginStateGet = true;
                    this.setState({});
                }
            })*/
        fetchPost('/usee/mockData').then(res=>{
            console.log(res)
        })
    }
    componentDidUpdate(){
        if (this.state.loginStateGet === false){
            console.log('tiaozhuan')
            let userInfo = getSessionStore('userInfo');
            console.log(userInfo)
            if (userInfo) {
                this.state.empInfo = userInfo;
                this.state.loginStateGet = true;
                this.setState({});
            }
        }
        /*if (this.state.loginStateGet === false){

            fetchGet('/api/user/userInfo').then(res => {
                if (res.code == 200 && res.data.id) {

                    this.state.empInfo = res.data;
                    this.state.loginStateGet = true;
                    this.setState({});
                }
            })
        }*/
    }
    render(){
        let { url } = this.props.match;

        return(

            <div>
                    <div className="backstageTop">
                        <span className="gaihaiBack">
                            GaiGai博客后台
                        </span>
                        <Link to={`${url}/login`}>去登陆</Link>
                    <div className="userSetArea" style={{ "display": this.state.loginStateGet?'block':'none' }}>
                            <span className="avatarName mr_5">
                            {this.state.empInfo.nickname}
                            </span>
                            <span className="avatarPic">
                                <img src={this.state.empInfo.img} className="mr_5" alt={`${this.state.empInfo.nickname}的头像`} />
                                <Icon type="setting" className="cursorP" onClick={this.handleUserSetting}/>
                            </span>
                            <ul className="userSettingBox" style={{'display':this.state.openUserSet?'block':'none'}}>
                                <li className="operItem" onClick={this.handleExit}>退出登录</li>
                            </ul>
                        </div>
                    </div>
                    <Switch>

                        <Route path={`${url}/login`} component={LoginRoute}/>
                        <Route path={`${url}/addArticle`} component={AddArticle}/>
                        <Route path={`${url}/updateArticle/:id`} component={UpdateArticle}/>
                        <Route path={url} exact component={ArticleList}/>
                    </Switch>


            </div>


        )
    }
}

export default ManageHome;