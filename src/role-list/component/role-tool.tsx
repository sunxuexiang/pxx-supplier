import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class RoleTool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      modal: Function;
    };
  };

  static relaxProps = {
    // 展示关闭弹框
    modal: noop
  };

  render() {
    return (
      <div>
        {/*<div>*/}
        {/*  <Alert*/}
        {/*    message="操作提示:"*/}
        {/*    description={*/}
        {/*      <div>*/}
        {/*        <p>支持拖拽排序。</p>*/}
        {/*      </div>*/}
        {/*    }*/}
        {/*    type="info"*/}
        {/*  />*/}
        {/*</div>*/}
        <div className="handle-bar">
          <Button type="primary" onClick={this._showCateModal}>
            新增角色
          </Button>
        </div>
      </div>
    );
  }

  /**
   * 显示弹框
   */
  _showCateModal = () => {
    const { modal } = this.props.relaxProps;
    modal(true);
  };
}
