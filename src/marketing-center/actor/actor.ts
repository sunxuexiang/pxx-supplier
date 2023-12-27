import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

interface IPageResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class InfoActor extends Actor {
  defaultState() {
    return {
      // 直播功能开关状态
      liveStatus: false
    };
  }

  /**
   * 修改直播功能开关状态
   */
  @Action('info:liveStatus')
  liveStatus(state, status) {
    return state.set('liveStatus', status);
  }
}
