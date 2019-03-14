import React, { Component } from 'react';
import {fetchPost} from '../../js/fetch.js';
import {setSessionStore} from '../../js/func.js'
import { md5, MD5_SUFFIX} from '../../js/jiami.js';
import {
    Form, Icon, Input, Button
} from 'antd';

class NormalLogin extends Component{
    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            userName:'',
            password:''
        }
    }
    handleSubmit(e){
        e.preventDefault();

        this.props.form.validateFields((err,values)=>{
            if (!err) {
                let newPWD = md5(values.password + MD5_SUFFIX);
                fetchPost('/api/user/login',{
                    username:values.userName,
                    password: newPWD
                }).then((res)=>{
                    if(res.message == 'success'){

                        setSessionStore('userInfo',res.data);
                        this.props.cdLoginState(true);
                    }
                })

            }
        })
    }
    componentWillReceiveProps(){

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="loginContainer">
                <Form className="login-form" onSubmit={this.handleSubmit}>
                    <Form.Item>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" block>
                        登录
                    </Button>
                </Form>
            </div>
        )
    }
}
NormalLogin = Form.create({ name: 'normal_login' })(NormalLogin);
export default NormalLogin;