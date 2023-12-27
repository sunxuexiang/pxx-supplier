import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, util, cache } from 'qmkit';
import * as webApi from './webapi';
import InfoActor from './actor/actor';

export default class AppStore extends Store {
  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化方法
   */
  init = async () => {
    const { res: pageRes } = await webApi.liveStatus();
    console.log('debug88 pageRes', pageRes);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.dispatch(
        'info:liveStatus',
        pageRes.context.configVOList[0].status ? true : false
      );
    } else {
      message.error(pageRes.message);
    }
  };
}
