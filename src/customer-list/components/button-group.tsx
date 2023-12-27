import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop, AuthWrapper } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onAdd: Function;
      onShowAddRelatedModal: Function;
    };
  };

  static relaxProps = {
    onAdd: noop,
    onShowAddRelatedModal: noop
  };

  render() {
    const { onAdd, onShowAddRelatedModal } = this.props.relaxProps;

    return (
      <AuthWrapper functionName="f_customer_1">
        <div className="handle-bar">
          <Button type="primary" onClick={() => onAdd()}>
            添加客户
          </Button>

          <Button onClick={() => onShowAddRelatedModal(true)}>
            关联客户
          </Button>
        </div>
      </AuthWrapper>
    );
  }
}
