import * as React from 'react';
import { Relax } from 'plume2';
import { Alert, Button } from 'antd';
import { AuthWrapper, noop } from 'qmkit';

@Relax
export default class EquitiesTool extends React.Component<any, any> {
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
        <div>
          <Alert
            message="操作提示:"
            description={
              <div>
                <p>1、等级会员可关联会员权益，会员可享受等级对应的会员权益；</p>
                <p>2、权益关闭后，前端的权益展示和说明进行隐藏；</p>
                <p>3、支持拖拽排序。</p>
              </div>
            }
            type="info"
          />
        </div>
        <div className="handle-bar">
          <AuthWrapper functionName={'f_authority-manage_add'}>
            <Button type="primary" onClick={this._showCateModal}>
              新增权益
            </Button>
          </AuthWrapper>
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
