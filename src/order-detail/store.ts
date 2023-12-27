import { Store } from 'plume2';
import DetailActor from './actor/detail-actor';
import LoadingActor from './actor/loading-actor';
import TidActor from './actor/tid-actor';
import TabActor from './actor/tab-actor';
import PayRecordActor from './actor/pay-record-actor';
import { fromJS, Map } from 'immutable';

import * as webapi from './webapi';
import { addPay, fetchLogistics, fetchOrderDetail, payRecord } from './webapi';
import { message } from 'antd';
import LogisticActor from './actor/logistic-actor';
import { Const, history, ValidConst } from 'qmkit';
import NP from 'number-precision';

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
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (tid: string) => {
    this.transaction(() => {
      this.dispatch('loading:start');
      this.dispatch('tid:init', tid);
      this.dispatch('detail-actor:hideDelivery');
    });
    let num = [];
    const { res } = (await fetchOrderDetail(tid)) as any;
    let { code, context: orderInfo, message: errorInfo } = res;

    if (code == Const.SUCCESS_CODE) {
      const wareHouseVOPage =
        JSON.parse(localStorage.getItem('wareHouseVOPage')) || [];
      wareHouseVOPage.forEach((ware) => {
        if (ware.wareId == orderInfo.wareId) {
          orderInfo.wareName = ware.wareName;
        }
      });
      const payRecordResult = (await payRecord(tid)) as any;
      const { context: logistics } = (await fetchLogistics()) as any;
      const { res: needRes } = (await webapi.getOrderNeedAudit()) as any;

      orderInfo.tradeItems.forEach((item) => {
        if (!item.changedPrice) {
          item.changedPrice = item.price;
        }
        item.hasChanged = false;
        let zkPrice = NP.minus(NP.times(item.num, item.price), item.splitPrice);
        item.zkPrice = item.walletSettlements.length
          ? NP.minus(zkPrice, item.walletSettlements[0].reduceWalletPrice)
          : zkPrice;
      });
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('detail:init', orderInfo);
        this.dispatch(
          'receive-record-actor:init',
          payRecordResult.res.payOrderResponses
        );
        this.dispatch('detail-actor:setSellerRemarkVisible', true);
        this.dispatch(
          'detail-actor:remedySellerRemark',
          orderInfo.sellerRemark
        );
        this.dispatch('logistics:init', logistics || []);
        this.dispatch('detail:setNeedAudit', needRes.context.audit);
        if (orderInfo.logisticsCompanyInfo) {
          this.dispatch(
            'detail-actor:changeCompanyId',
            orderInfo.logisticsCompanyInfo
          );
        }
        if (orderInfo.tradeVOList) {
          orderInfo.tradeVOList.map((v, index) => {
            //供应商的订单
            num[index] = {
              selfSellerRemarkVisible: true,
              selfRemedySellerRemark: ''
            };
          });
          this.dispatch('detail:num', num);
        }
      });
    } else {
      message.error(errorInfo);
    }
  };

  /**
   * 添加收款单
   */
  onSavePayOrder = async (params) => {
    let copy = Object.assign({}, params);
    const payOrder = this.state()
      .get('payRecord')
      .filter((payOrder) => payOrder.payOrderStatus == 1)
      .first();
    copy.payOrderId = payOrder.payOrderId;
    const { res } = await addPay(copy);
    if (res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('添加收款单成功!');
      //刷新
      const tid = this.state().get('tid');
      this.setReceiveVisible();
      this.init(tid);
    } else {
      message.error(res.message);
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
    const tid = this.state().getIn(['detail', 'id']);
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.dispatch('tab:init', '2');
    }
  };

  onAudit = async (
    tid: string,
    audit: string,
    reason?: string,
    msg?: string
  ) => {
    if (audit !== 'CHECKED') {
      if (!reason.trim()) {
        message.error('请填写驳回原因');
        return;
      }
    }

    const { res } = await webapi.audit(tid, audit, reason);

    this.hideRejectModal();
    if (res.code == Const.SUCCESS_CODE) {
      message.success(audit == 'CHECKED' ? '审核成功' : '驳回成功');
      const tid = this.state().get('tid');
      this.init(tid);
    } else {
      msg ? message.error(msg) : message.error(res.message);
    }
  };

  /**
   * 发货
   */
  deliver = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    await this.fetchLogistics();
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      const tradeItems = this.state()
        .getIn(['detail', 'tradeItems'])
        .concat(this.state().getIn(['detail', 'gifts']));

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
    }
  };

  /**
   *  拆单 商家订单 发货
   */
  delivers = async (tid, tradeItems, gifts) => {
    await this.fetchLogistics();
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      let tradeItem = tradeItems;
      if (gifts) tradeItem = tradeItems.concat(gifts);
      const shippingItemList = tradeItem
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
    }
  };

  /**
   * 子订单发货
   */
  sonDeliver = async (trade) => {
    const tid = trade.id;
    await this.fetchLogistics();
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      const tradeItems = this.state()
        .getIn(['detail', 'tradeItems'])
        .concat(this.state().getIn(['detail', 'gifts']));

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
    }
  };

  changeDeliverNum = (skuId, isGift, num, index) => {
    if (index == null) {
      this.dispatch('detail-actor:changeDeliverNum', { skuId, isGift, num });
    } else {
      this.dispatch('detail-actor:changeDeliverNumS', {
        skuId,
        isGift,
        num,
        index
      });
    }
  };

  changePrice = (key, value, index) => {
    this.dispatch('detail-actor:changePrice', { key, value, index });
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

  showLogisticsCompany = async () => {
    const { res } = (await webapi.queryLogisticscompany()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('detail:companyInfo', res.context.logisticsCompanyVOList);
    } else {
      message.error('物流公司信息获取失败');
      return;
    }
    this.dispatch('detail-actor:modalLogisticsVisible', true);
  };

  showArea = () => {
    this.dispatch('detail-actor:areaVisible', true);
  };

  /**
   * 关闭物流公司信息modal
   */
  hideLogisticsCompany = () => {
    this.dispatch('detail-actor:modalLogisticsVisible', false);
  };

  /**
   * 关闭站点modal
   */
  hideareaVisible = () => {
    this.dispatch('detail-actor:areaVisible', false);
  };

  /**
   * 关闭发货modal
   */
  hideDeliveryModal = () => {
    this.dispatch('detail-actor:hideDelivery');
  };

  /**
   * 显示自提modal
   */
  showPickUModal = () => {
    this.dispatch('detail-actor:showPickUp', true);
  };

  /**
   * 自提
   */
  pickUp = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res } = await webapi.deliverVerify(tid);
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
    } else {
      this.dispatch('detail-actor:showPickUp', true);
    }
  };

  /**
   * 关闭自提modal
   */
  hidePickUpModal = () => {
    this.dispatch('detail-actor:hidePickUp', false);
  };

  /**
   * 兑换自提商品
   * @param param
   */
  savePickUp = async (param) => {
    let tradeId = this.state().get('tid');
    let res = await webapi.pickUpCommit(tradeId, param.pickUpCode);
    if (res.res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('保存发货成功!');
      this.hidePickUpModal();
      //刷新
      this.init(tradeId);
    } else {
      message.error(res.res.message);
    }
  };

  /**
   * 正常单子 发货
   */
  saveDelivery = async (param, providerTrade) => {
    let tid = this.state().getIn(['detail', 'id']);
    let tid2;
    const num = this.state().get('sNum');
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
    let tradeDelivery = Map();
    if (providerTrade && providerTrade.size == 0) {
      tradeDelivery = tradeDelivery.set(
        'shippingItemList',
        this.handleShippingItems(this.state().getIn(['detail', 'tradeItems']))
      );
      tradeDelivery = tradeDelivery.set(
        'giftItemList',
        this.handleShippingItems(this.state().getIn(['detail', 'gifts']))
      );
    } else {
      let List = this.state().getIn(['detail', 'tradeVOList']);
      tid2 = List.get(num).get('id');
      tradeDelivery = tradeDelivery.set(
        'shippingItemList',
        this.handleShippingItems(List.get(num).get('tradeItems'))
      );
      tradeDelivery = tradeDelivery.set(
        'giftItemList',
        this.handleShippingItems(List.get(num).get('gifts'))
      );
    }
    tradeDelivery = tradeDelivery.set('deliverNo', param.deliverNo);
    tradeDelivery = tradeDelivery.set('deliverId', param.deliverId);
    tradeDelivery = tradeDelivery.set('deliverTime', param.deliverTime);

    let res;
    if (providerTrade && providerTrade.size == 0) {
      res = await webapi.deliver(tid, tradeDelivery);
    } else {
      res = await webapi.delivers(tid2, tradeDelivery);
    }
    if (res.res.code == Const.SUCCESS_CODE) {
      //成功
      message.success('保存发货成功!');
      //刷新
      this.init(tid);
    } else {
      message.error(res.res.message);
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
   * 作废发货记录
   * @param params
   * @returns {Promise<void>}
   */
  obsoleteDeliver = async (params) => {
    const tid = this.state().getIn(['detail', 'id']);

    const { res } = await webapi.obsoleteDeliver(tid, params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('作废发货记录成功!');
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 回审
   * @param params
   * @returns {Promise<void>}
   */
  retrial = async (_params) => {
    const tid = this.state().getIn(['detail', 'id']);

    const { res } = await webapi.retrial(tid);
    if (res.code == Const.SUCCESS_CODE) {
      this.init(tid);
      message.success('回审成功!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 作废收款记录
   * @param params
   * @returns {Promise<void>}
   */
  destroyOrder = async (params) => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res: verifyRes } = await webapi.verifyAfterProcessing(tid);

    if (verifyRes.code === Const.SUCCESS_CODE && verifyRes.context.length > 0) {
      message.error('订单已申请退货，不能作废收款记录');
      return;
    }

    const { res } = await webapi.destroyOrder(params);

    if (res.code === Const.SUCCESS_CODE) {
      message.success('作废成功');
      this.init(tid);
    } else {
      message.error(res.message);
    }
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
   * 显示/取消供应商备注修改
   * @param param
   */
  setSelfSellerRemarkVisible = (key, param: boolean) => {
    this.dispatch('detail-actor:setSelfSellerRemarkVisible', { key, param });
  };

  setSelfSellerRemark = (key, param: string) => {
    this.dispatch('detail-actor:selfRemedySellerRemark', { key, param });
  };
  /**
   * 修改卖家备注
   * @param param
   * @returns {Promise<void>}
   */
  remedySellerRemark = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const details = this.state().get('detail');
    let sellerRemark = this.state().get('remedySellerRemark');
    // console.log(sellerRemark,'sellerRemark')
    // if(!sellerRemark || sellerRemark == '') {
    //   sellerRemark = details.toJS().sellerRemark
    // }

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
   * 修改供应商备注
   * @param param
   * @returns {Promise<void>}
   */
  remedySelfSellerRemark = async (index, tid) => {
    const supplierNum = this.state().get('supplierNum');
    console.info(
      '>>>>>>',
      supplierNum,
      supplierNum.get(index).get('selfRemedySellerRemark')
    );
    if (supplierNum.get(index).get('selfRemedySellerRemark').size > 60) {
      message.error('备注长度不得超过60个字符');
      return;
    }
    const { res } = await webapi.remedySelfSellerRemark(
      tid,
      supplierNum.get(index).get('selfRemedySellerRemark')
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('备注修改成功');
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

  /**
   * 获取卖家收款账号
   * @returns {Promise<void>}
   */
  fetchOffLineAccounts = async () => {
    const { res } = await webapi.checkFunctionAuth(
      '/account/receivable',
      'POST'
    );
    if (!res.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    const result = await webapi.fetchOffLineAccout();
    if (result) {
      this.dispatch('receive-record-actor:setReceiveVisible');
    }
  };

  /**
   * 设置添加收款记录是否显示
   */
  setReceiveVisible = () => {
    this.dispatch('receive-record-actor:setReceiveVisible');
  };

  /**
   * 确认收款单
   */
  onConfirm = async (id) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.payConfirm(ids);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('确认成功');
      const tid = this.state().getIn(['detail', 'id']);
      this.init(tid);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示驳回弹框
   */
  showRejectModal = () => {
    this.dispatch('detail-actor:reject:show');
  };

  /**
   *关闭驳回弹框
   */
  hideRejectModal = () => {
    this.dispatch('detail-actor:reject:hide');
  };

  /**
   *改变物流公司
   */
  changeCompanyInfo = (value) => {
    this.dispatch('detail-actor:changeCompanyId', value);
  };

  changeAreaInfo = (value) => {
    this.dispatch('detail-actor:changeAreaInfo', value);
    /* this.dispatch('detail-actor:companyShowArea',value);*/
  };

  updateTradeCompany = async () => {
    let company = this.state().get('company');
    /*
    let arearInfo=this.state().get('areaInfo');
    const name=company.get('logisticsName');
    const phone=company.get('logisticsPhone');
    this.dispatch('detail-actor:companyShow',{name,phone});*/

    let tradeId = this.state().get('tid');
    let id = company.get('id');
    let areaInfo = this.state().get('areaInfo');
    const { res } = await webapi.updateTradeLogisticsCompany(
      tradeId,
      id,
      areaInfo
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('确认成功');
      this.hideLogisticsCompany();
      this.hideareaVisible();
      await this.init(tradeId);
    } else {
      message.error(res.message);
      this.hideareaVisible();
      this.hideLogisticsCompany();
    }
  };

  //保存大客户价
  saveVipPrice = async () => {
    const params = { tradeItems: [] };
    const detail = this.state()
      .get('detail')
      .toJS();
    const tradeItems = detail.tradeItems;
    tradeItems.forEach((item) => {
      params.tradeItems.push({
        oid: item.oid, //tradeItem.oid
        storeId: item.storeId, //商家号
        spuId: item.spuId,
        skuId: item.skuId,
        devanningId: item.devanningId,
        wareId: item.wareId,
        price: item.price, //下订单价格
        changedPrice: item.changedPrice //上次发的是vip价格，现在改下changedPrice
      });
    });
    const { res } = await webapi.changeItemPrice({ id: detail.id, params });
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init(detail.id);
    } else {
      message.error(res.message || '');
    }
  };
}
