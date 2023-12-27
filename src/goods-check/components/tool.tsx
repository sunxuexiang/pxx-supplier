import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, message } from 'antd';
import { IList } from 'typings/globalType';
import { withRouter } from 'react-router';
import { noop, AuthWrapper } from 'qmkit';

const confirm = Modal.confirm;

@withRouter
@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      tabIndex: string;
      onSpuDelete: Function;
      selectedSpuKeys: IList;
    };
  };

  static relaxProps = {
    tabIndex: 'tabIndex',
    onSpuDelete: noop,
    selectedSpuKeys: 'selectedSpuKeys'
  };

  render() {
    const tabIndex = this.props.relaxProps.tabIndex;
    if (tabIndex == '2') {
      return null;
    }
    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_goods_del">
          <Button onClick={this._spuCheckedFunc}>批量删除</Button>
        </AuthWrapper>
      </div>
    );
  }

  _spuCheckedFunc = () => {
    const { onSpuDelete, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
      return;
    }
    confirm({
      title: '提示',
      content: '是否确定批量删除选中的商品？',
      onOk() {
        onSpuDelete();
      }
    });
  };
}
