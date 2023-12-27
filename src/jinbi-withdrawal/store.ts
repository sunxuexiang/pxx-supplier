import { IOptions, Store } from 'plume2';

import { fromJS, List } from 'immutable';
import { message } from 'antd';
import InfoActor from './actor/actor';
import * as webapi from './webapi';
import { Const, history, cache } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new InfoActor()];
  }

  init = async () => {
    this.queryCustomerWallet();
    this.fetchAccountList();
  };

  fetchAccountList = async () => {
    const { res } = await webapi.fetchWithDrawalList();
    if (res && res.code === Const.SUCCESS_CODE) {
      let defaultAccount;
      res.context?.forEach((item) => {
        if (item.bankStatus === 0) {
          defaultAccount = item;
        }
      });
      if (!defaultAccount) {
        defaultAccount = res.context[0];
      }
      this.dispatch('state:update', {
        key: 'editBankInfo',
        value: fromJS({
          accountName: defaultAccount?.accountName,
          bankName: defaultAccount?.bankName,
          bankNo: defaultAccount?.bankNo
        })
      });
    } else {
      message.error(res.message || '');
    }
  };

  //查询鲸币账户余额
  queryCustomerWallet = async () => {
    const params = {
      storeFlag: true,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId
    };
    const { res } = await webapi.queryCustomerWallet(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('state:update', {
        key: 'accountMoney',
        value: res.context?.balance || 0
      });
    } else {
      message.error(res.message || '');
    }
  };

  /**
   * 修改信息
   */
  update = (params) => {
    this.dispatch('state:update', params);
  };

  //修改银行信息
  onEditConfirm = (values) => {
    this.dispatch('state:update', {
      key: 'editBankInfo',
      value: fromJS(values)
    });
  };

  //提现提交
  onSubmit = async () => {
    const withdrawalNum = this.state().get('withdrawalNum');
    if (!withdrawalNum) {
      message.error('请输入提现金额');
      return;
    }
    const editBankInfo = this.state()
      .get('editBankInfo')
      .toJS();
    const params = {
      dealPrice: withdrawalNum ? Number(withdrawalNum) : 0,
      bankCode: editBankInfo.bankNo,
      bankBranch: editBankInfo.accountName,
      backName: editBankInfo.bankName
    };
    this.dispatch('state:update', { key: 'loading', value: true });
    const { res } = await webapi.withdrawalSubmit(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('提现申请提交成功', 2, () => {
        this.dispatch('state:update', { key: 'loading', value: false });
        history.push('/jinbi-account');
      });
    } else {
      this.dispatch('state:update', { key: 'loading', value: false });
      message.error(res.message || '');
    }
  };
}
