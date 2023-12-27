import { Store } from 'plume2';
import GrouponActor from './actor/actor';
import { fromJS } from 'immutable';
import { Const, history, QMMethod } from 'qmkit';
import { message } from 'antd';
import * as webapi from './webapi';

export default class AppStore extends Store {
  saveFunc = QMMethod.onceFunc(() => {
    this.save();
  }, 1500);

  constructor(props) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new GrouponActor()];
  }

  /**
   * 初始化
   */
  async init(activityId?) {
    const res = await Promise.all([
      webapi.getCateList(),
      webapi.getBrandList(),
      webapi.getGrouponCateList(),
      webapi.getGoodsAuditFlag()
    ]);

    this.dispatch('groupon:init', {
      cates: fromJS((res[0].res as any).context),
      brands: fromJS((res[1].res as any).context),
      grouponCates: fromJS(
        (res[2].res as any).context.grouponCateVOList.filter(
          (i) => i.defaultCate == 0
        )
      ),
      goodsAuditFlag: (res[3].res as any).context.goodsAuditFlag
    });

    if (activityId) {
      let result = (await webapi.detail(activityId)).res as any;
      const activity = result.context.grouponActivity;
      const goodsInfos = result.context.grouponGoodsInfos;
      let params = {
        grouponActivityId: activity.grouponActivityId,
        grouponNum: activity.grouponNum,
        startTime: activity.startTime,
        endTime: activity.endTime,
        grouponCateId: activity.grouponCateId,
        autoGroupon: activity.autoGroupon,
        freeDelivery: activity.freeDelivery,
        selectedSkus: goodsInfos.map((item) => {
          let sku = {} as any;
          sku.grouponGoodsId = item.grouponGoodsId;
          sku.grouponActivityId = item.grouponActivityId;
          sku.goodsInfoId = item.goodsInfoId;
          sku.grouponPrice = item.grouponPrice;
          sku.startSellingNum = item.startSellingNum;
          sku.limitSellingNum = item.limitSellingNum;
          sku.marketPrice = item.marketPrice;
          sku.goodsName = item.goodsName;
          sku.specText = item.specText;
          return item;
        })
      };
      this.dispatch('groupon:edit:init', fromJS(params));
    }

    this.changeFormField('loading', false);
  }

  /**
   * 修改表单
   */
  changeFormField = (key, value) => {
    this.dispatch('groupon:change:field', { key, value });
  };

  /**
   * 选择拼团商品
   * @param newGoodsList
   */
  onChooseGoods = (newGoodsList) => {
    this.dispatch('groupon:choose:sku', newGoodsList);
  };

  /**
   * 修改选择的单品的字段(拼团价格/起售数量/限购数量)
   */
  changeSelectSkuInfo = (params) => {
    this.dispatch('groupon:change:sku:info', params);
  };

  /**
   * 删除sku
   */
  deleteSelectedSku = (skuId) => {
    this.dispatch('groupon:del:sku', skuId);
  };

  /**
   * 保存
   */
  async save() {
    const state = this.state().toJS();

    // 1.活动基本信息
    const params = {
      grouponActivityId: state.grouponActivityId,
      grouponNum: state.grouponNum,
      startTime: state.startTime,
      endTime: state.endTime,
      grouponCateId: state.grouponCateId,
      autoGroupon: state.autoGroupon,
      freeDelivery: state.freeDelivery
    } as any;
    // 2.活动商品信息
    params.goodsInfos = state.selectedSkus.map((item) => {
      let sku = {} as any;
      sku.grouponGoodsId = item.grouponGoodsId;
      sku.goodsInfoId = item.goodsInfoId;
      sku.grouponPrice = item.grouponPrice;
      sku.startSellingNum = item.startSellingNum;
      sku.limitSellingNum = item.limitSellingNum;
      return sku;
    });

    let res;
    if (state.isEdit) {
      // 编辑
      res = (await webapi.modify(params)) as any;
    } else {
      // 保存
      res = (await webapi.add(params)) as any;
    }

    if (res.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      history.push('/groupon-activity-list');
    } else if (res.res.code === 'K-080019') {
      if (state.isEdit) {
        message.error('商品已存在于其它进行中拼团活动，请修改起止时间');
      } else {
        message.error('商品已存在于其它进行中拼团活动');
      }
    } else if (res.res.code === 'K-080020') {
      message.error(res.res.message);
    } else if (res.res.code === 'K-080021') {
      message.error(res.res.message);
    } else {
      message.error('操作失败');
    }
  }
}
