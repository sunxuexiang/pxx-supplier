import { Store, IOptions } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const, checkAuth } from 'qmkit';

import SettingActor from './actor/setting-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);

    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettingActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    const { res } = await webapi.fetchSetting();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('setting:init', fromJS((res as any).context));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 点击按钮 - 修改基本信息
   */
  editSetting = async (settings) => {
    if (checkAuth('f_basicSetting_1')) {
      settings.storeId = this.state().getIn(['settings', 'storeId']);
      const { res } = await webapi.editSetting(settings);
      if (res.code == Const.SUCCESS_CODE) {
        message.success('修改成功!');
        this.init();
      } else {
        message.error(res.message);
      }
    } else {
      message.error('暂无操作权限');
    }
  };
}
