import { Store } from 'plume2';
import LiveDetailActor from './actor/live-detail-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
import * as webApi from './webapi';

export default class AppStore extends Store {
  bindActor() {
    return [new LiveDetailActor()];
  }

  /**
   * 初始化方法
   */
  init = async (id) => {
    const { res: pageRes } = await webApi.getById(id);
    if (pageRes.code === Const.SUCCESS_CODE) {
      this.dispatch('init:detail', pageRes.context.liveRoomVO);
      this.dispatch('init:liveGoodsList', pageRes.context.liveGoodsList);
      this.dispatch('info:setGoodsInfoList', pageRes.context.goodsInfoVOList);
      this.dispatch('info:setStoreName', pageRes.context.storeName);
    } else {
      message.error(pageRes.message);
    }
  };
}
