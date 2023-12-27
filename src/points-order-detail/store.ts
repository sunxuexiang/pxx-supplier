import { Store } from 'plume2';
import DetailActor from './actor/detail-actor';
import LoadingActor from './actor/loading-actor';
import TidActor from './actor/tid-actor';
import TabActor from './actor/tab-actor';
import PayRecordActor from './actor/pay-record-actor';
import { fromJS, Map } from 'immutable';

import * as webapi from './webapi';
import { fetchLogistics, fetchOrderDetail, payRecord } from './webapi';
import { message } from 'antd';
import LogisticActor from './actor/logistic-actor';
import { Const, history, ValidConst } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [
      new DetailActor(),
      new LoadingActor(),
      new TidActor(),
      new TabActor(),
      new PayRecordActor(),
      new LogisticActor()
    ];
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
      this.dispatch('detail-actor:hideDelivery');
    });

    const { res } = (await fetchOrderDetail(tid)) as any;
    let { code, context: orderInfo, message: errorInfo } = res;
    if (code == Const.SUCCESS_CODE) {
      const payRecordResult = (await payRecord(tid)) as any;
      const { context: logistics } = (await fetchLogistics()) as any;
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('detail:init', orderInfo);
        this.dispatch(
          'receive-record-actor:init',
          payRecordResult.res.payOrderResponses
        );
        this.dispatch('detail-actor:setSellerRemarkVisible', true);
        this.dispatch('logistics:init', logistics);
      });
    } else {
      message.error(errorInfo);
    }
  };

  onTabsChange = (key: string) => {
    this.dispatch('tab:init', key);
  };

  /**
   * 详情页签 发货
   * @returns {Promise<void>}
   */
  onDelivery = async () => {
    this.dispatch('tab:init', '2');
  };

  /**
   * 发货
   */
  deliver = async () => {
    await this.fetchLogistics();
    const detail = this.state().get('detail');
    console.log(detail);
    const tradeItems = this.state()
      .getIn(['detail', 'tradeItems']);

    const shippingItemList = tradeItems
      .filter((v) => {
        return v.get('deliveringNum') && v.get('deliveringNum') != 0;
      })
      .map((v) => {
        return {
          skuId: v.get('skuId'),
          itemNum: v.get('deliveringNum')
        };
      })
      .toJS();
    if (
      shippingItemList.length <= 0 ||
      fromJS(shippingItemList).some(
        (val) => !ValidConst.noZeroNumber.test(val.get('itemNum'))
      )
    ) {
      message.error('请填写发货数量');
    } else {
      this.showDeliveryModal();
    }
  };

  changeDeliverNum = (skuId, isGift, num) => {
    this.dispatch('detail-actor:changeDeliverNum', { skuId, isGift, num });
  };

  /**
   * 确认收货
   */
  confirm = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res } = await webapi.confirm(tid);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('确认收货成功!');
      //刷新
      const tid = this.state().get('tid');
      this.init(tid);
    } else if (res.code == 'K-000001') {
      message.error('订单状态已改变，请刷新页面后重试!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示发货modal
   */
  showDeliveryModal = () => {
    this.dispatch('detail-actor:showDelivery', true);
  };

  /**
   * 关闭发货modal
   */
  hideDeliveryModal = () => {
    this.dispatch('detail-actor:hideDelivery');
  };

  /**
   * 发货
   */
  saveDelivery = async (param) => {
    const tid = this.state().getIn(['detail', 'id']);

    // if (__DEV__) {
    //   console.log('保存发货', tradeItems, tid)
    // }
    // const shippingItemList = tradeItems.filter((v) => {
    //   return v.get('deliveringNum') && v.get('deliveringNum') != 0
    // }).map((v) => {
    //   return {
    //     skuId: v.get('skuId'),
    //     skuNo: v.get('skuNo'),
    //     itemNum: v.get('deliveringNum')
    //   }
    // }).toJS()
    //
    //

    let tradeDelivery = Map();
    tradeDelivery = tradeDelivery.set(
      'shippingItemList',
      this.handleShippingItems(this.state().getIn(['detail', 'tradeItems']))
    );
    tradeDelivery = tradeDelivery.set('deliverNo', param.deliverNo);
    tradeDelivery = tradeDelivery.set('deliverId', param.deliverId);
    tradeDelivery = tradeDelivery.set('deliverTime', param.deliverTime);

    const { res } = await webapi.deliver(tid, tradeDelivery);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('保存发货成功!');
      //刷新
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  handleShippingItems = (tradeItems) => {
    return tradeItems
      .filter((v) => {
        return v.get('deliveringNum') && v.get('deliveringNum') != 0;
      })
      .map((v) => {
        return {
          skuId: v.get('skuId'),
          skuNo: v.get('skuNo'),
          itemNum: v.get('deliveringNum')
        };
      })
      .toJS();
  };

  /**
   * 显示/取消卖家备注修改
   * @param param
   */
  setSellerRemarkVisible = (param: boolean) => {
    this.dispatch('detail-actor:setSellerRemarkVisible', param);
  };

  /**
   * 设置卖家备注
   * @param param
   */
  setSellerRemark = (param: string) => {
    this.dispatch('detail-actor:remedySellerRemark', param);
  };

  /**
   * 修改卖家备注
   * @param param
   * @returns {Promise<void>}
   */
  remedySellerRemark = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const sellerRemark = this.state().get('remedySellerRemark');
    if (sellerRemark.length > 60) {
      message.error('备注长度不得超过60个字符');
      return;
    }
    const { res } = await webapi.remedySellerRemark(tid, sellerRemark);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('卖家备注修改成功');
      const tid = this.state().getIn(['detail', 'id']);
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 获取物流公司
   * @returns {Promise<void>}
   */
  fetchLogistics = async () => {
    const { res: logistics } = (await webapi.fetchLogistics()) as any;

    this.dispatch('logistics:init', logistics.context);
  };

  /**
   * 验证订单客户是否已刪除
   * @returns {Promise<void>}
   */
  verify = async (tid: string) => {
    const buyerId = this.state().getIn(['detail', 'buyer', 'id']);
    const { res } = await webapi.verifyBuyer(buyerId);
    if (res) {
      message.error('客户已被删除，不能修改订单！');
      return;
    } else {
      history.push('/order-edit/' + tid);
    }
  };
}
