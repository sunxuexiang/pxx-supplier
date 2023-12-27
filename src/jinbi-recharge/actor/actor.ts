import { Actor, Action } from 'plume2';

export default class InfoActor extends Actor {
  defaultState() {
    return {
      // 账户余额
      accountMoney: '',
      // 充值金额
      rechargeNum: 0,
      // 微信支付二维码
      wechatPayUrl: '',
      // 支付宝支付二维码
      aliPayUrl: '',
      // 步骤
      step: 1,
      // 二维码失效时间
      endTime: '',
      // 支付方式
      payType: 0
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
