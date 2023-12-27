import React, { useState, useEffect } from 'react';
import './rich-text.less';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { ContentUtils } from 'braft-utils';
import { Button, message, Icon } from 'antd';
import { PhotoGallery, QMUpload, Const } from 'qmkit';

const RichText = (props) => {
  // 编辑器实例
  const [editorState, setEditorState] = useState<any>();
  // 图片大小10M
  const [FILE_MAX_SIZE] = useState(10 * 1024 * 1024);
  // 图片库
  const [showImgUpload, setShowImgUpload] = useState(false);
  // messge标识
  const [richUpload] = useState('richUpload');
  // 上传loading
  const [isLoading, setLoading] = useState(false);
  // 初始化
  useEffect(() => {
    setEditorState(BraftEditor.createEditorState(''));
    if (props.defaultContent) {
      setEditorState(BraftEditor.createEditorState(props.defaultContent));
    } else {
      setEditorState(BraftEditor.createEditorState(''));
    }
  }, [props.defaultContent]);
  // 本地上传图片
  const editImages = (info) => {
    const { file } = info;
    console.warn(file.status, info);
    if (info.file.status === 'uploading') {
      if (!isLoading) {
        message.loading({ content: '正在上传图片...', key: richUpload });
        setLoading(true);
      }
      return false;
    }
    if (file.status === 'done') {
      if (
        file.response &&
        file.response.code &&
        file.response.code !== Const.SUCCESS_CODE
      ) {
        message.error({ content: '上传失败', key: richUpload, duration: 1 });
        setLoading(false);
      } else {
        message.success({
          content: `${file.name} 上传成功！`,
          key: richUpload,
          duration: 1
        });
        setLoading(false);
        const imgInfo = eval('(' + file.response + ')');
        setEditorState(
          ContentUtils.insertMedias(editorState, [
            { type: 'IMAGE', url: imgInfo.url }
          ])
        );
      }
    }
  };
  /**
   * 检查文件格式
   */
  const checkUploadFile = (file, fileList) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过10M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
  // 扩展功能
  const extendControls: any = [
    {
      key: 'photo-gallery',
      type: 'component',
      component: (
        <div className="rich-text-editor-btn ">
          <QMUpload
            name="uploadFile"
            onChange={editImages}
            showUploadList={false}
            action={Const.HOST + '/uploadImage4UEditor'}
            multiple={true}
            accept={'.jpg,.jpeg,.png,.gif'}
            beforeUpload={checkUploadFile}
          >
            <Button type="link" icon="picture" style={{ color: '#6a6f7b' }}>
              图片
            </Button>
          </QMUpload>
          <Button
            style={{ marginLeft: 20, color: '#6a6f7b' }}
            type="link"
            icon="read"
            onClick={() => {
              setShowImgUpload(true);
            }}
          >
            图片库
          </Button>
        </div>
      )
    }
  ];
  //编辑器工具栏。可以根据需要选择
  const controls: any = [
    'undo',
    'redo',
    'separator',
    'font-size',
    'line-height',
    'letter-spacing',
    'separator',
    'text-color',
    'bold',
    'italic',
    'underline',
    'strike-through',
    'separator',
    'superscript',
    'subscript',
    'remove-styles',
    'emoji',
    'separator',
    'text-indent',
    'text-align',
    'separator',
    'headings',
    'list-ul',
    'list-ol',
    'blockquote',
    'code',
    'separator',
    'link',
    'separator',
    'hr',
    'separator',
    // 'media',
    'separator',
    'clear'
  ];
  /**
   * 富文本必须有onChange事件，事件中的参数是当前富文本框内的值，需要手动绑定一下
   * */
  const handleEditorState = (editorState: any) => {
    // 在编辑内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    if (props.contentChange) {
      props.contentChange(editorState.toHTML());
    }
    setEditorState(editorState);
  };
  return (
    <div
      className="rich-text-container"
      style={{
        height: props.height ? props.height + 132 : 350
      }}
    >
      <BraftEditor
        value={editorState}
        controls={controls}
        onChange={handleEditorState}
        extendControls={extendControls}
        contentStyle={{ height: props.height ? props.height : 200 }}
      />
      {/* 图片库 */}
      <PhotoGallery
        show={showImgUpload}
        hide={() => {
          setShowImgUpload(false);
        }}
        maxCount={6}
        setImg={(data) => {
          const list = data.map((item) => {
            return { type: 'IMAGE', url: item.artworkUrl };
          });
          setEditorState(ContentUtils.insertMedias(editorState, [...list]));
        }}
      />
    </div>
  );
};
export default RichText;
