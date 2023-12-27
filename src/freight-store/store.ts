import { Store, IOptions } from 'plume2';

import { message } from 'antd';
import { fromJS } from 'immutable';
import { Const, history } from 'qmkit';

import FreightStoreActor from './actor/freight-store-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FreightStoreActor()];
  }

  /**
   * 初始化模板信息
   */
  init = async (freightId) => {
    const { res } = (await webapi.fetchFreightStore(freightId)) as any;
    const {
      freightTempName,
      destinationArea,
      destinationAreaName,
      freightType,
      satisfyPrice,
      satisfyFreight,
      fixedFreight,
      defaultFlag,
      selectedAreas,
      wareId
    } = res.context;

    this.dispatch('freight: init', {
      freightTempName,
      wareId,
      destinationArea: fromJS(destinationArea.split(',')),
      destinationAreaName: fromJS(destinationAreaName.split(',')),
      freightType,
      satisfyPrice,
      satisfyFreight,
      fixedFreight,
      defaultFlag,
      selectedAreas: fromJS(selectedAreas),
      freightTempId: freightId
    });
  };

  /**
   * 查询已经被选中的区域Ids
   */
  fetchSelectedAreaIds = async () => {
    const { res } = (await webapi.fetchSelectedAreaIds()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('freight: store: field: value', {
        field: 'selectedAreas',
        value: fromJS(res.context)
      });
    }
  };

  /**
   * 存储区域Id
   */
  areaIdsSave = (ids, labels) => {
    this.transaction(() => {
      this.dispatch('freight: store: field: value', {
        field: 'destinationArea',
        value: fromJS(ids)
      });
      this.dispatch('freight: store: field: value', {
        field: 'destinationAreaName',
        value: fromJS(labels)
      });
    });
  };

  /**
   * 店铺模板根据字段修改值
   *
   * @memberof AppStore
   */
  storeFreightFieldsValue = ({ field, value }) => {
    this.dispatch('freight: store: field: value', { field, value });
  };

  /**
   * 保存运费模板
   */
  saveStoreFreight = async () => {
    let request = this.state().toJS();
    const { freightType, freightTempId } = request;
    if (freightType == 0) {
      request.fixedFreight = null;
    } else {
      request.satisfyPrice = null;
      request.satisfyFreight = null;
    }
    if (!freightTempId) {
      request.freightTempId = null;
    }
    if (!request.wareId) return message.error('请选择发货仓');
    const { res } = (await webapi.freightStoreSave(request)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      const pageType = this.state().get('pageType');
      // history.push({
      //   pathname:
      //     pageType === 0 ? '/delivery-to-home' : '/delivery-to-same-city',
      //   state: { tab: 0, type: 'temp' }
      // });
      history.push({
        pathname: '/logistics-tabs',
        state: { mainTab: '4', tab: 0 }
      });
    } else {
      message.error(res.message);
    }
  };

  changePageType = (pageType) => {
    this.dispatch('freight: pageType', pageType);
  };
}
