import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';

import { message } from 'antd';
import { Const } from 'qmkit';
import InfoActor from './actor/info-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    // debug
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化
   * @returns {Promise<void>}
   */
  init = async () => {
    const { res } = (await webapi.fetchCompanyInfo()) as any;
    this.dispatch('infomation:init', fromJS(res.context));
  };

  /**
   * 编辑
   * @param info
   * @returns {Promise<void>}
   */
  editInfo = async (info) => {
    //省市区处理
    info.companyInfoId = this.state().getIn(['infomation', 'companyInfoId']);
    info.provinceId = info.area[0];
    info.cityId = info.area[1];
    info.areaId = info.area[2];
    const { res } = await webapi.saveCompanyInfo(info);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('修改公司信息成功');
    }
  };
}
