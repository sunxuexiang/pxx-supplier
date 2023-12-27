import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, message } from 'antd';
import { IList } from 'typings/globalType';
import { withRouter } from 'react-router';
import { AuthWrapper, noop } from 'qmkit';

const confirm = Modal.confirm;

@withRouter
@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      spuCheckedFunc: Function;
      LiveGoodsCheckedIds: IList;
    };
  };

  static relaxProps = {
    spuCheckedFunc: noop,
    LiveGoodsCheckedIds: 'LiveGoodsCheckedIds'
  };

  render() {
    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_goods_audit">
          <Button onClick={this._spuCheckedFunc}>批量提审</Button>
        </AuthWrapper>
      </div>
    );
  }

  _spuCheckedFunc = () => {
    const { spuCheckedFunc, LiveGoodsCheckedIds } = this.props.relaxProps;
    if (LiveGoodsCheckedIds.count() < 1) {
      message.error('至少选择一条商品');
      return;
    }
    confirm({
      title: '提示',
      content: '是否确定批量提审选中的商品？',
      onOk() {
        spuCheckedFunc();
      }
    });
  };
}
