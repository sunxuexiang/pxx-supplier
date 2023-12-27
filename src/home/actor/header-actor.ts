import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class HeaderActor extends Actor {
  defaultState() {
    return {
      //头部提示
      header: {
        // 首条开始信息
        preTxt: '',
        // 首条错误信息
        errTxt: '',
        // 首条中间提示信息
        postTxt: '',
        // 首条中间错误
        midErr: '',
        // 首条最后信息
        lastTxt: '',
        // 底部文字
        text: '',
        // 底部蓝色
        bottomErrTxt: ''
      }
    };
  }

  /**
   * 头部信息单个字段
   * @param state
   * @param param1
   */
  @Action('common: header')
  onHeaderChange(state: IMap, header) {
    return state.set('header', fromJS(header));
  }
}
