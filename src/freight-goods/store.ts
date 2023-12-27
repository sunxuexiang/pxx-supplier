import { Store, IOptions } from 'plume2';

import { message } from 'antd';
import { Const, history } from 'qmkit';
import { fromJS } from 'immutable';

import FreightGoodsActor from './actor/freight-goods-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FreightGoodsActor()];
  }

  /**
   *  设置页面来源类型
   */
  setPageType = (pageType) => {
    this.dispatch('goods: freight: pageType', pageType);
  };

  /**
   * 查询单品运费模板
   */
  init = async (freightTempId, isCopy) => {
    const pageType = this.state().get('pageType');
    const { res } = (await webapi.fetchFreightGoods(
      freightTempId,
      pageType
    )) as any;
    if (res.code == Const.SUCCESS_CODE) {
      const {
        areaId,
        cityId,
        provinceId,
        freightTempName,
        defaultFlag,
        deliverWay,
        freightFreeFlag,
        freightTemplateGoodsExpresses,
        freightTemplateGoodsFrees,
        specifyTermFlag,
        valuationType,
        wareId
      } = res.context;
      this.transaction(() => {
        this.dispatch('goods: freight: init', {
          wareId,
          areaId,
          cityId,
          provinceId,
          freightTempName: isCopy
            ? `${freightTempName}的副本`
            : freightTempName,
          defaultFlag: isCopy ? 0 : defaultFlag,
          deliverWay,
          freightFreeFlag,
          freightTemplateGoodsExpresses,
          freightTemplateGoodsFrees,
          specifyTermFlag,
          valuationType,
          freightTempId
        });
        this.dispatch('goods: freight: copy', isCopy);
      });
    } else {
      message.error(res.message);
      history.goBack();
    }
  };

  /**
   * 发货地区存储
   */
  areaSave = (areaIds) => {
    this.dispatch('goods: freight: area', {
      provinceId: areaIds[0],
      cityId: areaIds[1],
      areaId: areaIds[2]
    });
  };

  /**
   * 单品运费模板存储
   */
  saveGoodsFreight = async () => {
    let {
      copyFlag,
      freightTempId,
      freightTempName,
      provinceId,
      cityId,
      areaId,
      freightFreeFlag,
      valuationType,
      defaultFlag,
      specifyTermFlag,
      deliverWay,
      freightTemplateGoodsExpressSaveRequests,
      freightTemplateGoodsFreeSaveRequests,
      wareId
    } = this.state().toJS();
    freightTemplateGoodsExpressSaveRequests =
      freightTemplateGoodsExpressSaveRequests.length > 0
        ? freightTemplateGoodsExpressSaveRequests
            .map((f) => {
              if (f.id.toString().startsWith('add_')) {
                f.id = null;
                if (f.delFlag == 1) {
                  f = null;
                }
              }
              return f;
            })
            .filter((f) => f)
        : [];
    freightTemplateGoodsFreeSaveRequests =
      freightTemplateGoodsFreeSaveRequests.length > 0
        ? freightTemplateGoodsFreeSaveRequests
            .map((f) => {
              if (f.id.toString().startsWith('add_')) {
                f.id = null;
                if (f.delFlag == 1) {
                  f = null;
                }
              }
              return f;
            })
            .filter((f) => f && f.destinationArea.length > 0)
        : [];
    let request = {
      freightTempName,
      provinceId,
      cityId,
      areaId,
      freightFreeFlag,
      valuationType,
      defaultFlag,
      specifyTermFlag,
      deliverWay,
      freightTemplateGoodsExpressSaveRequests,
      freightTemplateGoodsFreeSaveRequests,
      wareId
    } as any;
    if (copyFlag) {
      freightTempId = null;

      freightTemplateGoodsExpressSaveRequests =
        freightTemplateGoodsExpressSaveRequests.length > 0
          ? freightTemplateGoodsExpressSaveRequests.map((f) => {
              f.id = null;
              f.freightTempId = null;
              return f;
            })
          : [];
      freightTemplateGoodsFreeSaveRequests =
        freightTemplateGoodsFreeSaveRequests.length > 0
          ? freightTemplateGoodsFreeSaveRequests
              .map((f) => {
                f.id = null;
                f.freightTempId = null;
                return f;
              })
              .filter((f) => f)
          : [];
    }
    if (freightTempId) {
      request.freightTempId = freightTempId;
    }
    if (!wareId) return message.error('请选择发货仓');
    const pageType = this.state().get('pageType');
    const { res } = (await webapi.saveFreightGoods(request, pageType)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success(freightTempId ? '修改成功' : '新增成功');
      // history.push({
      //   pathname:
      //     pageType === 0 ? '/delivery-to-home' : '/delivery-to-same-city',
      //   state: { tab: 1, type: 'temp' }
      // });
      history.push({
        pathname: '/logistics-tabs',
        state: { mainTab: '4', tab: 1 }
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 更改指定字段值
   */
  changeFieldValue = ({ field, value }) => {
    this.dispatch('goods: freight: field: change', { field, value });
  };

  /**
   * 添加运送方式
   */
  shippingTypeAdd = () => {
    this.dispatch('goods: freight: shipping: add');
  };

  /**
   * 删除运送方式
   */
  shippingTypeSub = (id) => {
    this.dispatch('goods: freight: shipping: sub', id);
  };

  /**
   * 配送地区设置
   */
  changeAreaIds = (id, ids, labels) => {
    this.transaction(() => {
      this.dispatch('goods: freight: express: field', {
        id,
        field: 'destinationArea',
        value: fromJS(ids)
      });
      this.dispatch('goods: freight: express: field', {
        id,
        field: 'destinationAreaName',
        value: fromJS(labels)
      });
    });
  };

  /**
   * 修改goodsExpressSaveRequests指定字段值
   */
  goodsExpressSaveRequestsFieldValue = (id, field, value) => {
    this.dispatch('goods: freight: express: field', { id, field, value });
  };

  /**
   * 修改goodsFreeSaveRequests指定字段值
   */
  goodsFreeSaveRequestsFieldValue = (id, field, value) => {
    this.dispatch('goods: freight: free: field', { id, field, value });
  };

  /**
   * 包邮运费模板添加
   */
  goodsFreeAdd = () => {
    this.dispatch('goods: freight: free: add');
  };

  /**
   * 包邮运费模板删除
   */
  goodsFreeSub = (id) => {
    this.dispatch('goods: freight: free: sub', id);
  };

  /**
   * 改变是否包邮
   */
  changeFreightFree = (flag) => {
    this.dispatch('goods: freight: free', flag);
  };

  /**
   * 更改是否选中指定条件包邮
   */
  changeSpecifyTermFlag = (flag) => {
    this.dispatch('goods: freight: specify: change', flag);
  };

  /**
   * 配送指定包邮地区设置
   */
  changeFreeAreaIds = (id, ids, labels) => {
    this.transaction(() => {
      this.dispatch('goods: freight: free: field', {
        id,
        field: 'destinationArea',
        value: ids
      });
      this.dispatch('goods: freight: free: field', {
        id,
        field: 'destinationAreaName',
        value: labels
      });
    });
  };

  /**
   * 更改计价方式
   */
  changeValuationType = (value) => {
    this.dispatch('goods: freight: valuation: change', value);
  };
}
