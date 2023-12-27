import React from 'react';
import { Modal, Upload, message } from 'antd';
import { UploadProps } from 'antd/lib/upload/interface';
import { Const } from 'qmkit';

/**
 * 图片上传组件，在Upload基础上增加了预览默认弹窗显示功能
 */
export default class QMUpload extends React.Component<UploadProps, any> {
  state = {
    previewVisible: false,
    previewImage: ''
  };

  render() {
    const { children, onChange, beforeUpload, ...rest } = this.props;

    return (
      <div>
        <Upload
          headers={{
            Accept: 'application/json',
            Authorization:
              'Bearer' +
              ((window as any).token ? ' ' + (window as any).token : '')
          }}
          onPreview={(file) =>
            this.setState({
              previewVisible: true,
              previewImage: file.response ? file.response[0] : file.url
            })
          }
          onDownload={(file) => {
            //新窗口打开即可
            let tempWindow = window.open();
            tempWindow.location.href = file.response ? file.response[0] : file.url;
          }}
          beforeUpload={(file, fileList) => {
            if (!file.name.trim()) {
              message.error('请输入文件名');
              return false;
            }

            if (
              /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(
                file.name
              )
            ) {
              message.error('请输入正确格式的文件名');
              return false;
            }

            if (file.name.length > 40) {
              message.error('文件名过长');
              return false;
            }
            return beforeUpload ? beforeUpload(file, fileList) : true;
          }}
          {...rest}
          onChange={(fileEntity) => this._onChange(fileEntity, onChange)}
        >
          {children}
        </Upload>

        {this.state.previewVisible ? (
          <Modal maskClosable={false}
            className="bg-color preview-modal"
            visible={this.state.previewVisible}
            footer={null}
            onCancel={() => {
              this.setState({ previewVisible: false });
            }}
          >
            <img alt="example" src={this.state.previewImage} />
          </Modal>
        ) : null}
      </div>
    );
  }

  /**
   * 在业务的onChange上再封装一层，解决通过antd上传组件之后，base64版本的图片不存在导致的上传失败问题
   *
   * @param fileEntity
   * @param onChange
   * @private
   */
  _onChange = (fileEntity, onChange) => {
    let { fileList, file, ...rest } = fileEntity;

    // beforeUpload校验未通过，不进行处理
    if (!file.status) {
      return;
    }

    /**
     * 后台统一拦截异常，页面只能获取到200状态，status都是done，但是response里面会有异常的编码。
     * 上传成功时file.response里面直接是图片的地址列表，所以这里针对response.code进行判断。修改file的状态
     */
    if (file.status == 'error') {
      message.error(file.name + ' 上传失败！');
    } else if (
      file.status == 'done' &&
      file.response &&
      file.response.code &&
      file.response.code !== Const.SUCCESS_CODE
    ) {
      message.error(file.name + ' 上传失败！');
      file.status = 'error';
    }

    /**
     * 只保留上传中的或者上传成功的
     * uploading:上传中
     * done && !response:多个图片，编辑状态下初始化给出的图片
     * done && response && !response.code:刚上传的，并且上传成功
     */
    fileList = fileList.filter(
      (f) =>
        f.status == 'uploading' ||
        (f.status == 'done' && !f.response) ||
        (f.status == 'done' && f.response && !f.response.code)
    );

    fileList.map((file) => {
      if (!file.thumbUrl && file.response && file.response[0]) {
        file.thumbUrl = file.response[0];
      }
      return file;
    });
    onChange({ file, fileList, ...rest });
  };
}
