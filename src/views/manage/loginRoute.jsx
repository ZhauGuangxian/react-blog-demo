import React,{Component} from 'react';
import NormalLogin from './login.jsx';
import { withRouter } from 'react-router';
//import {connect} from 'react-redux';
//import { toogleLogin } from './action.js';
//import store from './adminredux.js';
import {getSessionStore} from '../../js/func.js'

/*const mapStateToProps = (state)=>({state});
const mapDispatchToProps = (dispatch)=>{
    return{
        toggleLogin: (status) => {
            dispatch(toogleLogin(status))
        }
    }

}*/

class TLoginRoute extends Component{
    constructor(props){
        super(props);
        this.cdLoginState = this.cdLoginState.bind(this);
        //let {state,history:{replace}} = this.props;


    }
    cdLoginState(value){
        //let { toggleLogin, state} = this.props;

        if(value === true){
            this.props.history.replace('/manage')
        }
        //toggleLogin(value)

    }
    componentDidMount(){
        let userInfo = getSessionStore('userInfo')
        if (userInfo){
            this.props.history.replace('/manage')
        }
        /*if(this.props.state.isLogin === true){
            this.props.history.replace('/manage')
        }*/
    }

    render(){

        return(
            <div className="loginRouteContainer">
                一段文字
                <NormalLogin cdLoginState={this.cdLoginState}/>
            </div>

        )
    }
}

const LoginRoute = withRouter(TLoginRoute)
export default LoginRoute;