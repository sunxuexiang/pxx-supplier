import React from 'react';

import { Button, Dropdown, Menu, Icon, message } from 'antd';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import { IList, IMap } from 'typings/globalType';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      changeSettleStatus: Function;
      checkedSettleIds: IList;
      queryParams: IMap;
    };
  };

  static relaxProps = {
    changeSettleStatus: noop,
    checkedSettleIds: 'checkedSettleIds',
    queryParams: 'queryParams'
  };

  render() {
    const { queryParams } = this.props.relaxProps;
    const settleStatus = queryParams.get('settleStatus');
    return (
      <div className="handle-bar">
        <Dropdown
          disabled={settleStatus == 1}
          overlay={this._menu()}
          getPopupContainer={() => document.getElementById('page-content')}
        >
          <Button>
            批量操作<Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    );
  }

  _menu = () => {
    const { queryParams } = this.props.relaxProps;
    const settleStatus = queryParams.get('settleStatus');
    return (
      <Menu>
        {(settleStatus == 0 || settleStatus == 2) && (
          <Menu.Item>
            <a onClick={() => this._handleBatchOption(1)}>设为已结算</a>
          </Menu.Item>
        )}
        {settleStatus == 0 && (
          <Menu.Item>
            <a onClick={() => this._handleBatchOption(2)}>暂不处理</a>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  /**
   * 批量操作
   * @param status
   * @private
   */
  _handleBatchOption = status => {
    const { changeSettleStatus, checkedSettleIds } = this.props.relaxProps;
    if (checkedSettleIds && checkedSettleIds.size != 0) {
      changeSettleStatus(checkedSettleIds.toJS(), status);
    } else {
      message.error('您未勾选任何记录');
    }
  };
}
