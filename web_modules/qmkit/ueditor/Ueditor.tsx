import React from 'react';
import Const from '../config';
import './ueditor.config.js';
import './ueditor.all.min.js';
import './lang/zh-cn/zh-cn.js';
import './themes/default/css/ueditor.min.css';
import './third-party/zeroclipboard/ZeroClipboard.js';
import './third-party/jquery-1.10.2.min.js'

interface StringArray {
  [index: number]: string;
}

export default class UEditor extends React.Component<any, any> {
  editor: any;

  props: {
    ref?: any;
    id: string;
    toolbars?: StringArray;
    content?: string;
    imgType?: number;
    height: string;
    chooseImgs?: StringArray;
    maximumWords?: number;
    insertImg?: Function;
    onContentChange?: Function;
    onChange?:Function;
    value?:any;
  };

  static defaultProps = {
    toolbars: [
      // 'fullscreen', 'source', '|', 'undo', 'redo', '|',
      //       'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
      //       'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
      //       'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
      //       'directionalityltr', 'directionalityrtl', 'indent', '|',
      //       'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
      //       'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
      //       'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
      //       'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
      //       'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
      //       'print', 'preview', 'searchreplace', 'drafts', 'help'
      'fullscreen',
      'source',
      '|',
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'removeformat',
      'formatmatch',
      'pasteplain',
      '|',
      'forecolor',
      'backcolor',
      'selectall',
      'cleardoc',
      '|',
      'rowspacingtop',
      'rowspacingbottom',
      'lineheight',
      '|',
      'customstyle',
      'paragraph',
      'fontfamily',
      'fontsize',
      '|',
      'directionalityltr',
      'directionalityrtl',
      'indent',
      '|',
      'justifyleft',
      'justifycenter',
      'justifyright',
      'justifyjustify',
      '|',
      'touppercase',
      'tolowercase',
      '|',
      '|',
      'imagenone',
      'imageleft',
      'imageright',
      'imagecenter',
      'simpleupload',
      'insertimage',
      '|',
      'horizontal',
      'date',
      'time',
      '|',
      'print',
      'drafts'
    ],
    maximumWords: 50000
  };

  constructor(props) {
    super(props);
    this.state = {
      counter: 0 // this.editor.ready时+1，强制渲染一次内容。
    };
  }

  componentDidMount() {
    this.initEditor();
  }

  shouldComponentUpdate(nextProps,nextState){
    if(this.props.content!=nextProps.content || this.state.counter!=nextState.counter){
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    // 清除实例
    (window as any).UE.delEditor(this.props.id);
  }

  /**
   * 创建编辑器实例
   */
  initEditor() {
    // 先删除已有的所有实例
    const o = (window as any).UE.instants;
    const ownProp = Object.getOwnPropertyNames(o);
    ownProp.forEach((instant) => {
      if (o[instant].key) {
        // (window as any).UE.delEditor(o[instant].key);
      }
    });

    // 上传图片方法默认地址修改
    (window as any).UE.Editor.prototype._bkGetActionUrl = (window as any).UE.Editor.prototype.getActionUrl;
    (window as any).UE.Editor.prototype.getActionUrl = function(action) {
      if (action == 'uploadimage') {
        return Const.HOST + '/uploadImage4UEditor';
      } else if (action == 'config') {
        return null;
      } else {
        return this._bkGetActionUrl.apply(this, action);
      }
    };

    const id = this.props.id;
    this.editor = (window as any).UE.getEditor(this.props.id, {
      toolbars: [this.props.toolbars],

      enableAutoSave: false,
      saveInterval: 30000,
      maximumWords: this.props.maximumWords,
      wordOverFlowMsg:
        '<span style="color:red;">你输入的字符个数已经超出最大允许值</span>',
      imageActionName: 'uploadimage' /* 执行上传图片的action名称 */,
      imageFieldName: 'uploadFile' /* 提交的图片表单名称 */,
      imageMaxSize: 2048000 /* 上传大小限制，单位B */,
      imageAllowFiles: [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.bmp'
      ] /* 上传图片格式显示 */,
      imageCompressEnable: true /* 是否压缩图片,默认是true */,
      imageCompressBorder: 1600 /* 图片压缩最长边限制 */,
      imageInsertAlign: 'none' /* 插入的图片浮动方式 */,
      imageUrlPrefix: '' /* 图片访问路径前缀 */,
      imagePathFormat:
        '/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}' /* 上传保存路径,可以自定义保存路径和文件名格式 */,
      insertImg: this.props.insertImg
    });

    // 默认需要请求一次后端获得图片上传配置，没读到不让用图片上传，现在都配前端了，强制返回true
    this.editor.isServerConfigLoaded = () => true;

    this.editor.addListener('serverConfigLoaded', function(_x) {
      // do nothing
    });

    if (this.props.onContentChange) {
      this.editor.addListener('contentChange', () => {
        this.props.onContentChange(this.editor.getContent());
      });
    }

    const self = this;
    this.editor.ready((ueditor) => {
      if (!ueditor) {
        (window as any).UE.delEditor(id);
        self.initEditor();
      }
      this.setState({ counter: this.state.counter + 1 });
    });
  }

  render() {
    // render时editor可能还没有初始化完成，没有body与iframe属性
    // this.editor.ready后通过setState强制渲染一次
    if (
      this.editor &&
      this.editor.body &&
      this.editor.iframe &&
      this.props.content &&
      this.props.imgType != 2
    ) {
      this.editor.setContent(this.props.value || this.props.content);
    }
    return <div id={this.props.id} style={{ width: '100%' }} />;
  }
}
