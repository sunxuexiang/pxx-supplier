import React from 'react';
import { Relax } from 'plume2';
import { Button, message } from 'antd';

import { history, AuthWrapper } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      accountList: any;
    };
  };

  static relaxProps = {
    accountList: 'accountList'
  };

  render() {
    return (
      <AuthWrapper functionName="f_vendor_new_accounts">
        <div className="handle-bar">
          <Button type="primary" onClick={() => this._toNewAccounts()}>
            新增账号
          </Button>
        </div>
      </AuthWrapper>
    );
  }

  /**
   * route 新增账号
   */
  _toNewAccounts = () => {
    const { accountList } = this.props.relaxProps;
    if (accountList.toJS().length >= 5) {
      message.error('账号最多不能超过5个！');
    } else {
      history.push({
        pathname: '/vendor-new-accounts'
      });
    }
  };
}
