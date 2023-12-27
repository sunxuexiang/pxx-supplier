import { Actor, Action } from 'plume2';

export default class InfoActor extends Actor {
  defaultState() {
    return {
      // 账户余额
      accountMoney: 0,
      // 提现金额
      withdrawalNum: 0,
      // 编辑中的银行卡信息
      editBankInfo: {
        accountName: '', // 账户名称
        bankName: '', // 开户行
        bankNo: '' // 银行卡号
      },
      loading: false
    };
  }

  /**
   * 修改信息
   */
  @Action('state:update')
  stateUpdate(state, params) {
    return state.set(params.key, params.value);
  }
}
