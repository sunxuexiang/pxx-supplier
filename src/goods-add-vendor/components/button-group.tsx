import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onAdd: Function;
    };
  };

  static relaxProps = {
    onAdd: noop
  };

  render() {
    const { onAdd } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_vendor_add'}>
          <Button type="primary" onClick={() => onAdd()}>
            新增厂商
          </Button>
        </AuthWrapper>
      </div>
    );
  }
}
