import React from 'react';
import { Modal } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

/**
 * 图片上传组件，在Upload基础上增加了预览默认弹窗显示功能
 */
@Relax
export default class ImgModal extends React.Component<any, any> {
  props: {
    relaxProps?: {
      imgVisible: boolean;
      previewImage: string;

      clickImg: Function;
    };
  };

  static relaxProps = {
    imgVisible: 'imgVisible',
    previewImage: 'previewImage',

    clickImg: noop
  };

  render() {
    const { imgVisible, clickImg, previewImage } = this.props.relaxProps;
    return (
      <div>
        {imgVisible ? (
          <Modal  maskClosable={false}
            className="bg-color"
            visible={imgVisible}
            footer={null}
            onCancel={() => clickImg('')}
          >
            <img alt="example" src={previewImage} />
          </Modal>
        ) : null}
      </div>
    );
  }
}
