import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import EditModal from './edit-modal';
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
        {/* 编辑/新增弹框 */}
        <EditModal />
        <AuthWrapper functionName={'f_live_manage_add'}>
          <Button type="primary" onClick={() => onAdd()}>
            新增福袋
          </Button>
        </AuthWrapper>
      </div>
    );
  }
}
