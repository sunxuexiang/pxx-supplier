import { Store } from 'plume2';
import DetailActor from './actor/detail-actor';
import LoadingActor from './actor/loading-actor';
import { fromJS, Map } from 'immutable';

import { fetchOrderDetail, fetchPrintSetting } from './webapi';
import { message } from 'antd';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [new DetailActor(), new LoadingActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (tid: string) => {
    this.transaction(() => {
      this.dispatch('loading:start');
      this.dispatch('tid:init', tid);
    });
    const { res } = (await fetchOrderDetail(tid)) as any;
    let { code, context: orderInfo, message: errorInfo } = res;
    if (code == Const.SUCCESS_CODE) {
      this.dispatch('detail:init', orderInfo);
    } else {
      message.error(errorInfo);
    }
    const { res: printSetting } = (await fetchPrintSetting()) as any;
    if (printSetting.code === Const.SUCCESS_CODE) {
      this.dispatch('printSetting:init', printSetting.context.printConfigVO);
    }
    this.dispatch('loading:end');
  };
}
