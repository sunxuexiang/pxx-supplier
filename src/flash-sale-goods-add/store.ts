import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import { Const, history, QMMethod } from 'qmkit';
import FlashSaleGoodsActor from './actor/flash-sale-goods-actor';

import { addFlashsaleGoods, getCateList } from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
  }

  bindActor() {
    return [new FlashSaleGoodsActor()];
  }

  /**
   * 初始化
   */
  init = async ({ activityDate, activityTime }) => {
    this.dispatch('info: setActivityDate', activityDate);
    this.dispatch('info: setActivityTime', activityTime);
    const { res } = (await getCateList()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('new:cate:init', fromJS(res.context.flashSaleCateVOList));
    } else {
      message.error(message);
    }
  };

  /**
   * 存储键值
   */
  fieldsValue = ({ field, value }) => {
    this.dispatch('goods: info: field: value', {
      field,
      value
    });
  };

  /**
   * 修改时间区间
   */
  changeDateRange = ({ startTime, endTime }) => {
    this.dispatch('goods: info: date: range', {
      startTime,
      endTime
    });
  };

  /**
   * 点击完成，保存用户选择的商品信息
   * @param skuIds
   * @param rows
   */
  onOkBackFun = (skuIds, rows) => {
    //保存商品信息
    this.dispatch('goods: info: field: value', {
      field: 'chooseSkuIds',
      value: skuIds
    });
    this.dispatch('goods: info: field: value', {
      field: 'goodsRows',
      value: rows
    });
    //关闭弹窗
    this.dispatch('goods: info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   * 删除选中的商品
   */
  deleteSelectedSku = (id) => {
    this.dispatch('delete: selected: sku', id);
    const { form } = this.state().toJS();
    form.validateFields(['goodsInfoIds']);
  };

  /**
   * 选择商品弹框的关闭按钮
   */
  onCancelBackFun = () => {
    this.dispatch('goods: info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   * 变更商品各个字段信息
   * @param field
   * @param value
   */
  onGoodsChange = ({ goodsInfoId, field, value }) => {
    this.dispatch('modalActor: change:goods', { goodsInfoId, field, value });
  };

  /**
   * 输入框输入监听
   * @param params
   */
  onCateInputChange = ({ goodsInfoId, field, value }) => {
    const { cateList } = this.state().toJS();
    cateList.map((v) => {
      if (v.cateName == value) {
        const value = v.cateId;
        this.dispatch('modalActor: change:goods', {
          goodsInfoId,
          field,
          value
        });
      }
    });
  };

  doAdd = QMMethod.onceFunc(async () => {
    let result: any;
    let flashSaleGoodsVOList = new Array();
    const { goodsRows, activityDate, activityTime } = this.state().toJS();

    if (goodsRows == null || goodsRows.length == 0) {
      message.error('请选择商品');
      return;
    }
    goodsRows.map((goods) => {
      const minNum = goods.minNum ? goods.minNum : 1;
      const postage = goods.recommendFlag ? goods.recommendFlag : 0;
      // 限购数量不可大于100
      const maxNum = goods.convertStock
        ? goods.convertStock
        : goods.flashsaleStock;

      flashSaleGoodsVOList.push({
        activityDate: activityDate,
        activityTime: activityTime,
        goodsId: goods.goodsId,
        goodsInfoId: goods.goodsInfoId,
        price: goods.settlementPrice,
        stock: goods.flashsaleStock,
        cateId: goods.cateId,
        maxNum: maxNum > 100 ? 100 : maxNum,
        minNum: minNum,
        postage: postage
      });
    });
    result = await addFlashsaleGoods({
      flashSaleGoodsVOList: flashSaleGoodsVOList
    });
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      history.push(`/flash-sale-goods-list/${activityDate}/${activityTime}`);
    } else {
      message.error(result.res.message);
    }
  }, 1500);
}
