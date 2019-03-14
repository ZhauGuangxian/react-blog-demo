import React, { Component } from 'react';
import {  fetchPost} from '../../js/fetch.js';
import { Table, Button, Divider, Modal ,message} from 'antd';
import { withRouter} from 'react-router-dom';
const confirm = Modal.confirm;
class ArticleListO extends Component {
    constructor(props) {
        super(props);
        this.articlesList = [];
        this.onSelectChange = this.onSelectChange.bind(this);
        this.state={
            selectedRowKeys:[],
            articlesList:[],
            total:0,
            current:1,
            size:10
        }
        this.handlePagChange = this.handlePagChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.gotoAddNew = this.gotoAddNew.bind(this);
    }
    getAllList(start,pageSize = 10){
        fetchPost('/api/articles/getAllArticles', { start: start, pageSize: pageSize }).then(res => {
            if (res.message == 'success') {
                let articlesList = res.data.articlesList;
                this.setState({ articlesList, total: res.data.total })
            }
        })
    }
    componentDidMount(){
        if(sessionStorage.getItem('userInfo')){
            fetchPost('/api/articles/getAllArticles',{start:1,pageSize:10}).then(res=>{
                if(res.message == 'success'){
                    let articlesList = res.data.articlesList;
                    this.setState({ articlesList,total:res.data.total})
                }
            })
        }
    }

    handlePagChange(page,pageSize){
        this.setState({
            current:page
        })
        this.getAllList(page, pageSize)
    }

    onSelectChange(selectedRowKeys){
        this.setState({ selectedRowKeys})
    }

    handleEdit({id}=data){

        let {url} = this.props.match;
        let { history } = this.props;
        history.push(`${url}/updateArticle/${id}`)
    }
    handleDelete({id}=data){
        confirm({
            title:'警告',
            content:'确定要删除吗',
            onOk:()=>{
                fetchPost('/api/articles/deleteArticle', { id }).then(res => {
                    if (res.message == 'success'){
                        message.info('删除成功');
                        let { current, size} = this.state;
                        this.getAllList(current, size)
                    }
                })
            },
            onCancel(){

            }
        })

    }
    gotoAddNew(){
        const {url} = this.props.match;
        this.props.history.push(`${url}/addArticle`);
    }
    render() {
        let { selectedRowKeys, articlesList} = this.state;
        let pagination = {
            position:'bottom',
            pageSize:10,
            onChange:this.handlePagChange,
            total:this.state.total,
            current: this.state.current
        }
        let columns = [
            {
                title:'文章标题',dataIndex:'title',key:'title'
            },
            {
                title: '发布时间', dataIndex: 'createDate', key: 'createDate'
            }, {
                title: '文章简介', dataIndex: 'article_desc', key: 'article_desc'
            },{
                title: '操作',
                key: 'action',
                width:'140px',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={this.handleEdit.bind(this,record)}>编辑</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={this.handleDelete.bind(this,record)}>删除</a>
                    </span>
                ),
            }
        ]
        let rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let {url} = this.props.match;
        return (
            <div className="articlesListContainerOut">
                <div className="articlesListContainer">
                    <div style={{ 'color': "#333" }} className="nameTitle">文章管理
                        <Button type="primary" onClick={this.gotoAddNew}>发布文章</Button>
                    </div>
                    <Table bordered={true} rowSelection={rowSelection} columns={columns} dataSource={articlesList} rowKey="id" pagination={pagination}>

                    </Table>
                </div>

            </div>

        )
    }
}
const ArticleList = withRouter(ArticleListO);
export default ArticleList;