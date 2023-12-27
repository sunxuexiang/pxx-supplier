import { Store, IOptions } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';

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
      let context = res.context;
      if (context) {
        context.openFlag = context.openFlag == 1;
        context.commissionFlag = context.commissionFlag == 1;
        if (context.commissionFlag) {
          context.commissionRate = context.commissionRate * 100;
        } else {
          delete context.commissionRate;
        }
      } else {
        context = {};
      }
      this.dispatch('setting:init', fromJS(context));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 保存
   */
  editSetting = async () => {
    let settings = this.state()
      .get('setting')
      .toJS();
    settings.openFlag = settings.openFlag ? 1 : 0;
    settings.commissionFlag = settings.commissionFlag ? 1 : 0;
    settings.commissionRate = settings.commissionRate / 100;
    const { res } = await webapi.editSetting(settings);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改成功!');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 修改setting表单
   */
  changeFormValue = (key, value) => {
    this.dispatch('change:form:value', { key, value });
  };
}
