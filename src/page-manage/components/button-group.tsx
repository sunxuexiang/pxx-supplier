import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      setVisible: Function;
    };
  };

  static relaxProps = {
    setVisible: noop
  };

  render() {
    const { setVisible } = this.props.relaxProps;
    return (
      <div className="handle-bar">
        <Button type="primary" onClick={() => setVisible(true)}>
          新增页面
        </Button>
      </div>
    );
  }
}
