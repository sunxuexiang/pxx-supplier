/**
 * Created by feitingting on 2017/12/9.
 */

import { Actor, Action, IMap } from 'plume2';

export default class NewActor extends Actor {
  defaultState() {
    return {
      //新增的银行账户
      newAccounts: [
        { index: 0, bankCode: '', accountName: '', bankNo: '', bankBranch: '' }
      ],
      //所有银行列表
      allBanks: [],
      //计数变量
      num: 0,
      //原来的账户列表
      primaryBankList: []
    };
  }

  /**
   * 初始化所有银行列表
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('new:account:init')
  init(state: IMap, res) {
    return state.set('allBanks', res);
  }

  /**
   * 列表项
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('new:account:accounts')
  accounts(state: IMap, res) {
    return state.set('newAccounts', res);
  }

  /**
   * 计数变量增加1
   * @param state
   * @param num
   * @returns {Map<string, V>}
   */
  @Action('new:account:num')
  addNum(state: IMap, value) {
    return state.set('num', value);
  }

  /**
   * 初始化授权码信息
   */
  @Action('account:primary')
  primary(state: IMap, res) {
    return state.set('primaryBankList', res);
  }
}
