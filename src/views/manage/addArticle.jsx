import React,{Component} from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {withRouter} from 'react-router-dom';
import wEditor from 'wangeditor'
import { Button, Upload, Icon, message,Switch} from 'antd';
import {fetchPost} from '../../js/fetch.js';
import { formatDate } from '../../js/func';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    /*const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }*/

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
}
class AddArticleO extends Component{
    constructor(props){
        super(props);
        this.state = {
            //editorState: EditorState.createEmpty(),
            title:'',
            desc:'',
            cover:'',
            top_flag:99,
            loading: false,
        }
        //this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.handleArticlePoortxt = this.handleArticlePoortxt.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePicChange = this.handlePicChange.bind(this);
        this.handleIsTop = this.handleIsTop.bind(this);
        this.initEditor = this.initEditor.bind(this);

    }
    onEditorStateChange(editorState){
        this.setState({
            editorState
        })
    }
    initEditor(){
        const elem = this.refs.editorElem;
        const editor = new wEditor(elem);

        editor.customConfig.zIndex = 100;
        editor.customConfig.uploadImgServer = '/api/fileUpload';
        editor.customConfig.height="600px";
        editor.customConfig.uploadImgMaxLength = 1;
        editor.customConfig.uploadFileName = 'imageFile'
        editor.customConfig.uploadImgHooks = {
            customInsert: function (insertImg, result, editor) {
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                var url = result.data
                insertImg(url)

                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        }
        editor.customConfig.menus = [
            'head', // 标题
            'bold', // 粗体
            'fontSize', // 字号
            // 'fontName', // 字体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            // 'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            'quote', // 引用
            // 'emoticon', // 表情
            'image', // 插入图片
            // 'table', // 表格
            // 'video', // 插入视频
            'code', // 插入代码
            'undo', // 撤销
            'redo' // 重复
        ]
        editor.customConfig.lang = {
            '设置标题': 'Title',
            '字号': 'Size',
            '文字颜色': 'Color',
            '设置列表': 'List',
            '有序列表': '',
            '无序列表': '',
            '对齐方式': 'Align',
            '靠左': '',
            '居中': '',
            '靠右': '',
            '正文': 'p',
            '链接文字': 'link text',
            '链接': 'link',
            '上传图片': 'Upload',
            '网络图片': 'Web',
            '图片link': 'image url',
            '插入视频': 'Video',
            '格式如': 'format',
            '上传': 'Upload',
            '创建': 'init'
        }
        /*editor.customConfig.onchange = (html)=>{
            let blocks = this.refs.editorElem.querySelectorAll('pre code');
            blocks.forEach((block) => {
                hljs.highlightBlock(block)
            })

        }*/
        editor.create()
        this.editor = editor;

    }
    handleArticlePoortxt(type,event){
        let val = event.target.value;
        switch(type){
            case 1:
                this.setState({
                    title:val
                });
                break;
            case 2:
                this.setState({
                    desc:val
                });
                break;
            default:
                break;

        }
    }
    handleSubmit(){
        let { title, desc, cover, /*editorState,*/top_flag} = this.state;
        /*let content = draftToHtml(convertToRaw(editorState.getCurrentContent()));*/
        let content = this.editor.txt.html();
        let param = {
            title,
            article_desc:desc,
            cover, content,top_flag,
            createTime:formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')
        }

       fetchPost('/api/articles/addArticle', param).then(res => {
            if (res.message =='success'){
                let {url} = this.props.match;
                this.props.history.replace(`/manage`)
            }
        })
    }
    handlePicChange(info){
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {


            /*getBase64(info.file.originFileObj, cover => this.setState({
                cover,
                loading: false,
            }));*/
            this.setState({
                cover: info.file.response.data
            })
        }
    }
    handleIsTop(checked){
        if(checked){
            this.setState({
                top_flag:0
            })
        }else{
            this.setState({
                top_flag: 99
            })
        }
    }
    componentDidMount(){
        this.initEditor()
    }
    render(){
        //const editorState = this.state.editorState;
        const cover = this.state.cover;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return(
            <div className="articlesListContainer addArticleContainer">
                <div style={{ 'color': "#333" }} className="nameTitle">
                        写文章
                        <div>
                            置顶<Switch checkedChildren="开" unCheckedChildren="关" onChange={this.handleIsTop}/>
                            <Button className="ml_5" type="primary" onClick={this.handleSubmit} >发布</Button>
                        </div>
                </div>
                <div className="setTitle">
                    <p>文章标题</p>
                    <textarea className="titleForm" cols="30" rows="10" placeholder="请输入文章标题" onChange={this.handleArticlePoortxt.bind(this,1)}></textarea>
                </div>
                <div className="setDesc">
                    <p>文章摘要</p>
                    <textarea className="DescForm" cols="30" rows="10" placeholder="请输入文章摘要" onChange={this.handleArticlePoortxt.bind(this, 2)}></textarea>
                </div>
                <div className="setDesc">
                    <p>文章封面</p>
                    <Upload

                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        name="imageFile"
                        action="/api/fileUpload"
                        beforeUpload={beforeUpload}
                        onChange={this.handlePicChange}
                    >
                        {cover ? <img className="gaigaiPicPreview" src={cover} alt="avatar" /> : uploadButton}
                    </Upload>
                </div>
                <div className="setTags">
                    <p>贴标签</p>
                    <div className="likeForm tagsBox"></div>
                </div>
                <div className="setContext">
                    <p>编辑正文</p>

                    <div ref='editorElem' style={{ textAlign: 'left' }} className="myEditor"/>
                </div>
            </div>
        )
    }
}
const AddArticle = withRouter(AddArticleO);
export default AddArticle