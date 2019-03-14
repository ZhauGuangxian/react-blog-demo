import { combineReducers } from "redux";


const isLogin = (state = false, action)=>{
    if(typeof action.status !='undefined'){
        return action.status;
    }
    return state
}
let adminReducer = combineReducers({
    isLogin
})
export default adminReducer;