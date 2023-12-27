import { Store } from 'plume2';
import GrouponActor from './actor/actor';
import { fromJS } from 'immutable';
import { Const } from 'qmkit';
import { message } from 'antd';
import * as webapi from './webapi';

export default class AppStore extends Store {
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
  async init(activityId) {
    let result = (await webapi.detail(activityId)).res as any;
    let params = {
      baseInfo: result.context.grouponActivity,
      goodsInfos: result.context.grouponGoodsInfos
    };
    this.dispatch('groupon:detail:init', fromJS(params));
    this.orderPage();
  }

  /**
   * 订单分页查询
   */
  orderPage = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 订单编号
    const orderNo = this.state().get('orderNo');
    const { res } = await webapi.fetchOrderPage({
      tradeGroupon: {
        grouponActivityId: this.state().getIn(['baseInfo', 'grouponActivityId'])
      },
      id: orderNo,
      pageSize,
      pageNum
    });
    if (res.code === Const.SUCCESS_CODE) {
      res.context.content = res.context.content.map((item) => {
        let order = {} as any;
        order.orderNo = item.id;
        order.goodsInfoName = item.tradeItems[0].skuName;
        order.specText = item.tradeItems[0].specDetails;
        order.customerName = item.buyer.name;
        order.totalPrice = item.tradePrice.totalPrice;
        if (item.tradeGroupon) {
          order.grouponNo = item.tradeGroupon.grouponNo;
          order.grouponSuccessTime = item.tradeGroupon.grouponSuccessTime;
          order.returnNum = item.tradeGroupon.returnNum;
          order.returnPrice = item.tradeGroupon.returnPrice;
          order.grouponOrderStatus = item.tradeGroupon.grouponOrderStatus;
          order.payState = item.tradeState.payState;
        }
        return order;
      });
      this.dispatch('groupon:order:page', res.context);
    } else {
      message.error('操作失败');
    }
  };

  /**
   * 设置订单编号
   */
  setOrderNo = (orderNo) => {
    this.dispatch('groupon:order:no', orderNo);
  };
}
