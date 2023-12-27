import React from 'react';
import { Modal } from 'antd';

const defaultImg = require('../../images/none.png');

/**
 * 商品详情页图片展示，包含预览modal
 */
export default class GoodsImage extends React.Component<any, any> {
  state = {
    previewVisible: false,
    previewImage: ''
  };

  render() {
    const url = this.props.url;

    return (
      <div>
        <div className="smallitem">
          <img src={url || defaultImg} alt="" />
          {url && (
            <p
              onClick={() =>
                this.setState({ previewVisible: true, previewImage: url })
              }
            >
              预览
            </p>
          )}
        </div>

        {this.state.previewVisible ? (
          <Modal  maskClosable={false}
            className="bg-color"
            visible={this.state.previewVisible}
            footer={null}
            onCancel={() => {
              this.setState({ previewVisible: false });
            }}
          >
            <img src={this.state.previewImage} />
          </Modal>
        ) : null}
      </div>
    );
  }
}
