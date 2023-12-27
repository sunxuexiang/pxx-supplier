/**
 * Created by feitingting on 2017/12/9.
 */
import { Store } from 'plume2';
import { message } from 'antd';
import { Const, history } from 'qmkit';
import { fromJS } from 'immutable';
import NewActor from './actor/new-actor';
import * as webApi from './webapi';

export default class AppStore extends Store {
  bindActor() {
    return [new NewActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  /**
   * 初始化，获取所有银行账户列表及原有的
   * @returns {Promise<void>}
   */
  init = async () => {
    const { res: bank } = await webApi.fetchBaseBank();
    //商家原有的银行账户
    const { res: primaryBank } = await webApi.getAccountList();
    if (bank.code == Const.SUCCESS_CODE) {
      this.dispatch('new:account:init', fromJS(bank.context));
    }
    if (primaryBank.code == Const.SUCCESS_CODE) {
      this.dispatch('account:primary', fromJS(primaryBank.context));
    }
  };

  /**
   * 新增银行结算账户
   */
  addNewAccounts = () => {
    const newAccounts = this.state()
      .get('newAccounts')
      .toJS();
    const primaryBankList = this.state()
      .get('primaryBankList')
      .toJS();
    let currentKey = this.state().get('num');
    if (newAccounts.length + primaryBankList.length >= 5) {
      message.error('最多可添加5个结算账户');
      return;
    }
    newAccounts.push({
      accountId: null,
      bankName: '',
      bankCode: '',
      accountName: '',
      bankNo: '',
      bankBranch: '',
      key: currentKey
    });
    this.transaction(() => {
      //变量加1
      this.dispatch('new:account:num', currentKey + 1);
      this.dispatch('new:account:accounts', fromJS(newAccounts));
    });
  };

  /**
   * 输入框输入监听
   * @param params
   */
  onAccountInputChange = ({ ...params }) => {
    let newAccountArray = new Array();
    this.state()
      .get('newAccounts')
      .toJS()
      .map((v) => {
        if (v.key == params.id) {
          //bankName时，需要填充两个字段
          if (params.field == 'bankName') {
            v.bankName = params.value.split('_')[0];
            v.bankCode = params.value.split('_')[1];
          } else {
            v[params.field] = params.value;
          }
        }
        newAccountArray.push(v);
      });
    this.dispatch('new:account:accounts', fromJS(newAccountArray));
  };

  /**
   * 删除自定义银行账户
   * @param id
   */
  deleteAccount = (id) => {
    let newAccountArray = this.state()
      .get('newAccounts')
      .toJS()
      .filter((v) => v.key != id);
    this.dispatch('new:account:accounts', fromJS(newAccountArray));
  };

  /**
   * 保存新增的银行账户
   */
  saveNewAccount = async () => {
    const newAccounts = this.state()
      .get('newAccounts')
      .toJS();
    const { res } = await webApi.saveAccountAdd({
      offlineAccounts: newAccounts
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('新增成功');
      history.push('./vendor-payment-account');
    } else {
      message.error(res.message);
    }
  };
}
