import { Actor, Action } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class DetailActor extends Actor {
  defaultState() {
    return {
      visible: false,
      //当前打开的视频
      currentData: null,
      //上条视频
      preData: null,
      //下条视频
      nextData: null
    };
  }

  /**
   * 显示/关闭
   */
  @Action('detailActor: visible')
  setVisible(state, visible: boolean) {
    return state.set('visible', visible);
  }

  /**
   * state值更新
   */
  @Action('detailActor: update')
  update(state, opt) {
    return state.set(opt.key, opt.val);
  }
}
