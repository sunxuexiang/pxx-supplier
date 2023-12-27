import React from 'react';
import { Modal } from 'antd';

/**
 * 预览图片
 */
export default class ShowImageModel extends React.Component<any, any> {
  props: {
    visible: boolean;
    url: string;
    clickImg: Function;
  };

  render() {
    const { visible, clickImg, url } = this.props;
    return (
      <div>
        {visible ? (
          <Modal  maskClosable={false}
            className="bg-color"
            visible={visible}
            footer={null}
            onCancel={() => clickImg()}
          >
            <img alt="example" src={url} />
          </Modal>
        ) : null}
      </div>
    );
  }
}
