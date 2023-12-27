import React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import {AuthWrapper, noop} from 'qmkit';

@Relax
export default class Toolbar extends React.Component<any, any> {
  /**
   * 指定plume2中状态类型
   */
  props: {
    relaxProps?: {
      onCreate: Function;
    };
  };

  /**
   * 将plume2中的状态引入
   */
  static relaxProps = {
    onCreate: noop
  };

  render() {
    const { onCreate } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_store_level_add_1'}>
        <Button type="primary" onClick={() => onCreate()}>
          新增
        </Button>
        </AuthWrapper>
      </div>
    );
  }
}
