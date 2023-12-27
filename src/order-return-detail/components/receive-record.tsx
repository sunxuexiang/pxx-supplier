import React from 'react';
import { Relax } from 'plume2';
import { Modal } from 'antd';

import LogisticsAdd from './logistics-add';

/**
 * 退款记录
 */
@Relax
export default class ReceiverRecord extends React.Component<any, any> {
  static relaxProps = {};

  constructor(props) {
    super(props);
    this.state = { addLogisticsVisible: false };
  }

  render() {
    return (
      <div style={styles.container}>
        <label>
          【物流信息】<a
            href="javascript:void(1)"
            onClick={() => this.setState({ addLogisticsVisible: true })}
          >
            填写物流信息
          </a>
        </label>
        <Modal  maskClosable={false}
          title="填写物流信息"
          visible={this.state.addLogisticsVisible}
          onOk={() => {}}
          onCancel={() => {
            this.setState({ addLogisticsVisible: false });
          }}
          okText="确认"
          cancelText="取消"
        >
          <LogisticsAdd />
        </Modal>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 20
  } as any
};
