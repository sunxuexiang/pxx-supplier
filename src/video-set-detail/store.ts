import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import { Const, util, QMMethod } from 'qmkit';
import { fromJS } from 'immutable';
import DetailActor from './actor/detail';

export default class AppStore extends Store {
  // 搜索条件缓存
  searchCache = {} as any;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new DetailActor()];
  }

  init = async (videoId) => {
    const response = await webapi.getVideo(videoId);

    if (!response) return;
    const { res } = response;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('home:setting', fromJS(res.context.videoManagementVO));
      this.dispatch('home:videoId', videoId);
    }
  };
}
