/**
 * Created by feitingting on 2017/12/7.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class AccountActor extends Actor {
  defaultState() {
    return {
      //商家下面的店铺收款账户列表
      accountList: [],
      //店铺基本信息
      storeInfo: {},
      //提示设置主账号的弹框是否显示
      mainVisible: false,
      allBanks: [],
      //入驻时间
      applyEnterTime: ''
    };
  }

  /**
   * 初始化账户信息
   */
  @Action('account:init')
  init(state: IMap, res) {
    let accountArray = new Array();
    res.toJS().map(v => {
      accountArray.push(v);
    });
    //数组排序
    accountArray.sort((a, b) => {
      return b.isDefaultAccount - a.isDefaultAccount;
    });
    //如果没有主账号，提示设置主账
    if (res.filter(v => v.get('isDefaultAccount') == 1).size == 0) {
      return state
        .set('mainVisible', true)
        .set('accountList', fromJS(accountArray));
    } else {
      return state
        .set('accountList', fromJS(accountArray))
        .set('mainVisible', false);
    }
  }

  /**
   * 店铺基本信息
   * @param state
   * @param res
   */
  @Action('account:storeInfo')
  storeInfo(state, res) {
    return state.set('storeInfo', res);
  }

  /**
   * 设置主账号
   */
  @Action('modalActor:main')
  mainActor(state) {
    return state.set('mainVisible', !state.get('mainVisible'));
  }

  @Action('modalActor:close')
  closeModal(state) {
    return state.set('mainVisible', false);
  }

  /**
   * 初始化所有银行列表
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('account:allBanks')
  allBanks(state: IMap, res) {
    return state.set('allBanks', res);
  }

  @Action('account:applyEnterTime')
  enterTime(state, time: any) {
    return state.set('applyEnterTime', time);
  }
}
