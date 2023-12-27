import React from 'react';

import { Button } from 'antd';
import { IMap } from 'typings/globalType';
import { Relax } from 'plume2';

import { history, noop } from 'qmkit';

@Relax
export default class Bottom extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settlement: IMap;
      changeSettleStatus: Function;
    };
  };

  static relaxProps = {
    settlement: 'settlement',
    changeSettleStatus: noop
  };

  render() {
    return (
      <div>
        <div style={{ marginTop: 20 }}>
          <Button style={{ marginLeft: 10 }} onClick={() => history.goBack()}>
            返回
          </Button>
        </div>

        {/*{*/}
        {/*settlement.get('settleStatus') == 0 &&*/}
        {/*<div style={{marginTop: 20}}>*/}
        {/*<Button type="primary" onClick={() => this._handleSettleStatus(settlement.get('settleId'), 1)}>设为已结算</Button>*/}
        {/*<Button style={{marginLeft: 10}} type="primary" onClick={() => this._handleSettleStatus(settlement.get('settleId'), 2)}>暂不处理</Button>*/}
        {/*<Button style={{marginLeft: 10}} onClick={() => history.goBack()}>返回</Button>*/}
        {/*</div>*/}
        {/*}*/}
        {/*{*/}
        {/*settlement.get('settleStatus') == 1 &&*/}
        {/*<div style={{marginTop: 20}}>*/}
        {/*<Button style={{marginLeft: 10}} onClick={() => history.goBack()}>返回</Button>*/}
        {/*</div>*/}
        {/*}*/}
        {/*{*/}
        {/*settlement.get('settleStatus') == 2 &&*/}
        {/*<div style={{marginTop: 20}}>*/}
        {/*<Button type="primary" onClick={() => this._handleSettleStatus(settlement.get('settleId'), 2)}>暂不处理</Button>*/}
        {/*<Button style={{marginLeft: 10}} onClick={() => history.goBack()}>返回</Button>*/}
        {/*</div>*/}
        {/*}*/}
      </div>
    );
  }

  // _handleSettleStatus = (settleId, status) => {
  // 	const {changeSettleStatus} = this.props.relaxProps;
  // 	confirm({
  // 		title: '提示',
  // 		content: status == 1 ? '确定要将该条结算记录设置为\'已结算\'吗？' : '确定要将该条结算记录设置为\'暂不处理\'吗？',
  // 		onOk() {
  // 			changeSettleStatus([settleId], status);
  // 			history.goBack();
  // 		}
  // 	})
  // }
}
