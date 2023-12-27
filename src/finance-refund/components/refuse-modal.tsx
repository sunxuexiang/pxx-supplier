import React from 'react';
import { Relax } from 'plume2';
import { Input, Modal } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class RefuseModal extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      refuseVisible: boolean;
      onCancelRefuse: Function;
      onChangeReason: Function;
      saveRefuse: Function;
    };
  };

  static relaxProps = {
    refuseVisible: 'refuseVisible',
    onCancelRefuse: noop,
    onChangeReason: noop,
    saveRefuse: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      refuseVisible,
      onCancelRefuse,
      onChangeReason,
      saveRefuse
    } = this.props.relaxProps;
    return (
      <Modal  maskClosable={false}
        title="请填写拒绝退款的原因"
        visible={refuseVisible}
        onOk={() => saveRefuse()}
        onCancel={() => onCancelRefuse()}
      >
        <Input.TextArea
          onChange={e => onChangeReason((e.target as any).value)}
        />
      </Modal>
    );
  }
}
