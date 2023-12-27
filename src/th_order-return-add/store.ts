import { IOptions, Store } from 'plume2';
import { fromJS, Map } from 'immutable';
import { message, Modal } from 'antd';
import { IList } from 'typings/globalType';
import { Const, history, QMFloat } from 'qmkit';
import FormActor from './actor/form-actor';
import TradeActor from './actor/trade-actor';
import PriceActor from './actor/price-actor';
import ImageActor from './actor/image-actor';
import {
  addApply,
  fetchOrderReturnList,
  getReturnReasons,
  getReturnWays,
  getTradeDetail
} from './webapi';

const confirm = Modal.confirm;

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new FormActor(),
      new TradeActor(),
      new PriceActor(),
      new ImageActor()
    ];
  }

  init = async (tid: string) => {
    const returnReasonList = (await getReturnReasons()) as any;
    const returnWayList = (await getReturnWays()) as any;
    this.dispatch('formActor: init', {
      returnReasonList: fromJS(returnReasonList.res.context),
      returnWayList: fromJS(returnWayList.res.context)
    });

    let tradeDetail = (await getTradeDetail(tid)) as any;
    let originTradeItems = fromJS([]); //订单里原来的所有商品信息
    let canApplyPrice = tradeDetail.res.context.tradePrice.totalPrice;

    let isOnLine = tradeDetail.res.context.payInfo.payTypeId == '0';

    let orderReturnListRes = await fetchOrderReturnList(tid);
    let returnOrderList = [];
    if (orderReturnListRes.res && orderReturnListRes.res['context']) {
      returnOrderList = orderReturnListRes.res['context'];
    }

    // 在线支付订单，计算剩余退款金额
    if (isOnLine) {
      returnOrderList
        .filter((v) => {
          return v.returnFlowState == 'COMPLETED';
        })
        .forEach(
          (v) =>
            (canApplyPrice = QMFloat.accSubtr(
              canApplyPrice,
              v.returnPrice.applyStatus
                ? v.returnPrice.applyPrice
                : v.returnPrice.totalPrice
            ))
        );
    }

    // 已完结订单，则为退货申请，否则认为是退款申请
    // let isReturn =
    //   tradeDetail.res.context.tradeState.flowState == 'COMPLETED'
    //     ? true
    //     : false;
        let isReturn = true;

    // 退货申请，设置商品可退数量
    // if (isReturn) {
      originTradeItems = fromJS(tradeDetail.res.context.tradeItems);
      // 只展示有可退商品的信息
      tradeDetail.res.context.tradeItems = tradeDetail.res.context.tradeItems.filter(
        (v) => v.canReturnNum > 0
      );

      if (tradeDetail.res.context.gifts) {
        // 只展示有可退数量的赠品信息
        tradeDetail.res.context.gifts = tradeDetail.res.context.gifts.filter(
          (v) => v.canReturnNum > 0
        );
        // 默认赠品退货数量为0
        tradeDetail.res.context.gifts.forEach((v) => {
          v.num = 0; //初始化默认的退货数量
        });
      }

      // 默认退货数量为0
      tradeDetail.res.context.tradeItems.forEach((v) => {
        v.totalNum = v.num;
        // v.price = QMFloat.addZeroFloor(v.splitPrice / v.num); //初始化每个商品的均摊平均价格,向下截取金额
        v.price = QMFloat.addZeroFloor(v.splitPrice / v.num); //初始化每个商品的均摊平均价格,向下截取金额
        v.skuPoint = QMFloat.addZeroFloor((v.points || 0) / v.num); //初始化每个商品的均摊平均积分(向下截取小数点后两位)
        v.num = 0;
        // v.splitPrice = v.price;
        v.prices = v.price;
      });
    // }
    console.log(tradeDetail.res.context,'tradeDetail.res.context');
    

    this.dispatch('tradeActor: init', {
      tradeDetail: fromJS(tradeDetail.res.context),
      originTradeItems: originTradeItems,
      returnOrderList: fromJS(returnOrderList),
      isReturn: isReturn,
      isOnLine: isOnLine,
      canApplyPrice: canApplyPrice
    });
  };

  /**
   * 修改项
   */
  editItem = (key: string, value: string) => {
    this.dispatch('formActor: editItem', { key, value });
  };

  /**
   * 修改金额项
   */
  editPriceItem = (key: string, value: any) => {
    this.dispatch('priceActor: editPriceItem', { key, value });
  };

      /**
   * 修改价格
   */
  editGoodssplit = (skuId: string, value: number,bfprice) => {
    // if(Number(bfprice) < Number(value)) {
    //    this.dispatch('tradeActor: price', { skuId, bfprice });
    //    return
    // }
    // this.transaction(() => {
      // 1.修改退货商品数量
      console.log(value,'splproce');
      
      this.dispatch('tradeActor: price', { skuId, value });
      
        console.log(this.state()
        .get('tradeDetail')
        .get('tradeItems').toJS(),'111111111');
      // this.dispatch('priceActor: editPriceItem', { key, value });
      // 2.判断是否更新勾选的赠品,以及赠品数量(若修改数量的sku已被勾选,则计算并更新赠品数量)
      const skuIndex = this.state()
        .get('tradeDetail')
        .get('tradeItems')
        .findIndex((item) => item.get('skuId') == skuId);
        
      if (skuIndex > -1) {
        this._setReturnGifts();
      }
    // });
  };
    /**
   * 修改价格
   */
  editGoodsPrice = (skuId: string, value: number,bfprice) => {
    // if(Number(bfprice) < Number(value)) {
    //    this.dispatch('tradeActor: price', { skuId, bfprice });
    //    return
    // }
    // this.transaction(() => {
      // 1.修改退货商品数量
      // this.dispatch('tradeActor: price', { skuId, value });
      this.dispatch('tradeActor: prices', { skuId, value });
      
        console.log(this.state()
        .get('tradeDetail')
        .get('tradeItems').toJS(),'111111111');
      // this.dispatch('priceActor: editPriceItem', { key, value });
      // 2.判断是否更新勾选的赠品,以及赠品数量(若修改数量的sku已被勾选,则计算并更新赠品数量)
      const skuIndex = this.state()
        .get('tradeDetail')
        .get('tradeItems')
        .findIndex((item) => item.get('skuId') == skuId);
        
      if (skuIndex > -1) {
        this._setReturnGifts();
      }
    // });
  };

  /**
   * 修改数量
   */
  editGoodsNum = (skuId: string, value: number) => {
    this.transaction(() => {
      // 1.修改退货商品数量
      this.dispatch('tradeActor: editGoodsNum', { skuId, value });
      console.log(this.state()
        .get('tradeDetail')
        .get('tradeItems').toJS(),'111111111');
      // 2.判断是否更新勾选的赠品,以及赠品数量(若修改数量的sku已被勾选,则计算并更新赠品数量)
      const skuIndex = this.state()
        .get('tradeDetail')
        .get('tradeItems')
        .findIndex((item) => item.get('skuId') == skuId);
      if (skuIndex > -1) {
        this._setReturnGifts();
      }
    });
  };

  /**
   * 设置退货赠品数量
   */
  _setReturnGifts = () => {
    const trade = this.state().get('tradeDetail');
    const tradeMarketings = trade.get('tradeMarketings');
    if (tradeMarketings && tradeMarketings.size > 0) {
      const giftMarketings = tradeMarketings.filter(
        (tradeMarketing) => tradeMarketing.get('marketingType') == 2
      ); //找到满赠活动
      if (giftMarketings && giftMarketings.size > 0) {
        const tradeItems = this.state().get('originTradeItems'); //订单中的所有商品
        const giftItems = trade.get('gifts'); //订单中的赠品
        const comReturnOrders = this.state().get('returnOrderList'); //该订单之前已完成的退单list(分批退单的场景)
        let comReturnSkus = fromJS({}); //已经退的商品汇总(根据skuId汇总所有商品的数量)
        const currReturnSkus = trade
          .get('tradeItems')
          .filter((item) => item.get('num') > 0); //本次需要退的商品汇总
        let allReturnGifts = fromJS({}); //可能需要退的赠品汇总
        let comReturnGifts = fromJS({}); //已经退的赠品汇总

        // 1.汇总已经退的商品与赠品
        comReturnOrders.forEach((reOrder) => {
          reOrder.get('returnItems').forEach((returnItem) => {
            const currItem = comReturnSkus.get(returnItem.get('skuId'));
            if (currItem) {
              comReturnSkus = comReturnSkus.set(
                returnItem.get('skuId'),
                currItem.set('num', currItem.get('num') + returnItem.get('num'))
              );
            } else {
              comReturnSkus = comReturnSkus.set(
                returnItem.get('skuId'),
                returnItem
              );
            }
          });

          if (reOrder.get('returnGifts')) {
            reOrder.get('returnGifts').forEach((returnGift) => {
              const currGiftItemNum = comReturnGifts.get(
                returnGift.get('skuId')
              );
              if (currGiftItemNum) {
                comReturnGifts = comReturnGifts.set(
                  returnGift.get('skuId'),
                  currGiftItemNum + returnGift.get('num')
                );
              } else {
                comReturnGifts = comReturnGifts.set(
                  returnGift.get('skuId'),
                  returnGift.get('num')
                );
              }
            });
          }
        });

        // 2.遍历满赠营销活动list,验证每个活动对应的剩余商品(购买数量或金额-已退的总数或总金额)是否还满足满赠等级的条件
        //   PS: 已退的总数或总金额分为两部分: a.该订单关联的所有已完成的退单的商品 b.本次用户准备退货的商品
        giftMarketings.forEach((giftMarketing) => {
          if (4 == giftMarketing.get('subType')) {
            const leftSkuAmount = giftMarketing
              .get('skuIds')
              .map((skuId) => {
                const skuItem = tradeItems.get(
                  tradeItems.findIndex((item) => item.get('skuId') == skuId)
                );
                const comReSkuCount = comReturnSkus.get(skuId)
                  ? comReturnSkus.get(skuId).get('num')
                  : 0;
                const indexTmp = currReturnSkus.findIndex(
                  (item) => item.get('skuId') == skuId
                );
                const currReSkuCount =
                  indexTmp > -1 ? currReturnSkus.get(indexTmp).get('num') : 0;
                return (
                  skuItem.get('levelPrice') *
                  (skuItem.get('deliveredNum') - comReSkuCount - currReSkuCount)
                ); //某商品的发货商品价格 - 已退商品价格 - 当前准备退的商品价格
              })
              .reduce((sum, x) => sum + x, 0); //剩余商品价格汇总

            // 3.若不满足满赠条件,则退该活动的所有赠品,汇总到所有的退货赠品数量中(若满足满赠条件,则无需退赠品)
            if (
              leftSkuAmount < giftMarketing.get('giftLevel').get('fullAmount')
            ) {
              allReturnGifts = this._setReturnGiftsMap(
                allReturnGifts,
                giftMarketing
              );
            }
          } else if (5 == giftMarketing.get('subType')) {
            const leftSkuCount = giftMarketing
              .get('skuIds')
              .map((skuId) => {
                const skuItem = tradeItems.get(
                  tradeItems.findIndex((item) => item.get('skuId') == skuId)
                );
                const comReSkuCount = comReturnSkus.get(skuId)
                  ? comReturnSkus.get(skuId).get('num')
                  : 0;
                const indexTmp = currReturnSkus.findIndex(
                  (item) => item.get('skuId') == skuId
                );
                const currReSkuCount =
                  indexTmp > -1 ? currReturnSkus.get(indexTmp).get('num') : 0;
                return (
                  skuItem.get('deliveredNum') - comReSkuCount - currReSkuCount
                ); //某商品的发货商品数 - 已退商品数 - 当前准备退的商品数
              })
              .reduce((sum, x) => sum + x, 0); //剩余商品数量汇总

            // 3.若不满足满赠条件,则退该活动的所有赠品,汇总到所有的退货赠品数量中(若满足满赠条件,则无需退赠品)
            if (
              leftSkuCount < giftMarketing.get('giftLevel').get('fullCount')
            ) {
              allReturnGifts = this._setReturnGiftsMap(
                allReturnGifts,
                giftMarketing
              );
            }
          }
        });

        // 4.设置具体的退单赠品信息
        this._updateReturnGift(giftItems, allReturnGifts, comReturnGifts);
      }
    }
  };

  /**
   * 不满足满赠条件时,需要退的所有赠品
   * @param allReturnGifts 可能需要退的赠品汇总
   * @param giftMarketing 某个满赠营销活动
   * @return allReturnGifts 返回 不满足满赠条件,满赠营销活动中所有需要退的赠品信息,形如{'sku001':3,'sku002':1}
   */
  _setReturnGiftsMap = (allReturnGifts, giftMarketing) => {
    // 不满足满赠条件,则退该活动的所有赠品,汇总到所有的退货赠品数量中
    giftMarketing
      .get('giftLevel')
      .get('fullGiftDetailList')
      .forEach((gift) => {
        let currGiftItemCount = allReturnGifts.get(gift.get('productId'));
        if (currGiftItemCount) {
          allReturnGifts = allReturnGifts.set(
            gift.get('productId'),
            currGiftItemCount + gift.get('productNum')
          );
        } else {
          allReturnGifts = allReturnGifts.set(
            gift.get('productId'),
            gift.get('productNum')
          );
        }
      });
    return allReturnGifts;
  };

  /**
   * 更新具体的退单赠品数量信息
   * @param giftItems 订单中可退的赠品
   * @param allReturnGifts 不满足满赠条件,满赠营销活动中所有需要退的赠品信息
   * @param comReturnGifts 所有已完成退单中的退掉的赠品信息
   */
  _updateReturnGift(giftItems, allReturnGifts, comReturnGifts) {
    // 本次退单的退货赠品总数: 每个商品所有退货赠品数量 - 之前所有退单中已经退掉的赠品总数
    //   PS: 为了保证退单中赠品顺序与订单中的赠品顺序一致,遍历订单赠品,依次计算得出本次退单需要退的赠品list
    const newGiftItems = giftItems.map((tradeItem) => {
      let readyGiftItemNum = allReturnGifts.get(tradeItem.get('skuId')) || 0; //准备退的数量
      const totalNum = tradeItem.get('deliveredNum') || 0; //发货总数
      readyGiftItemNum =
        readyGiftItemNum < totalNum ? readyGiftItemNum : totalNum;
      const comGiftItemNum = comReturnGifts.get(tradeItem.get('skuId')) || 0; //之前已完成退单已经退掉的数量
      const currNum = readyGiftItemNum - comGiftItemNum;
      if (currNum > 0) {
        return tradeItem.set('num', currNum).set('giftChecked', true); //设置退的赠品数量,并勾选赠品
      } else {
        return tradeItem.set('num', 0).set('giftChecked', false);
      }
    });
    this.dispatch('tradeActor: updateGifts', newGiftItems);
  }

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('imageActor: editImages', images);
  };

  /**
   * 提交
   */
  add = async () => {
    const data = this.state();
    let param = Map();

    // tid
    param = param.set('tid', data.getIn(['tradeDetail', 'id']));

    // 退货原因
    param = param.set(
      'returnReason',
      Map().set(data.get('selectedReturnReason'), 0)
    );

    // 退货说明
    param = param.set('description', data.get('description').trim());

    // 退货商品信息
    let tradeItems = data.getIn(['tradeDetail', 'tradeItems']);

    // 退单附件
    param = param.set(
      'images',
      data.get('images').map((v, i) => {
        // 上传成功的图片才保存
        if (v.get('status') == 'done') {
          return JSON.stringify({
            uid: i + 1,
            status: 'done',
            url: v.get('response').get(0)
          });
        }
      })
    );

    // 退货申请
    if (data.get('isReturn')) {
      // 只保存退货商品数量大于0的商品
      tradeItems = tradeItems.filter((item) => item.get('num') > 0);
      console.log(tradeItems.toJS(),'tradeItemstradeItemstradeItems');
      let spliceprice = false;
      // tradeItems.toJS().forEach(e => {
      //   console.log(e.splitPrice);
        
      //   if(Number(e.splitPrice) <=  Number(e.price)) {
      //       spliceprice = true
      //     }
      // })
      // if(!spliceprice) {
      //    message.error('实退单价不能大于退货单价');
      //   return
      // }

      // 如果所有商品的退货数量都为0
      if (tradeItems.size == 0) {
        message.error('请填写退货数量');
        return;
      }

      // 退货方式
      param = param.set(
        'returnWay',
        Map().set(data.get('selectedReturnWay'), 0)
      );
    }

    param = param.set('returnItems', tradeItems);

    // 退款金额，退货是商品总额，退款是应付金额
    let totalPrice = data.get('isReturn')
      ? tradeItems
          .map((sku) => {
              return QMFloat.accMul(sku.get('price'), sku.get('num'));
            if (sku.get('num') < sku.get('canReturnNum')) {
              //小于可退数量,直接单价乘以数量
              return QMFloat.accMul(sku.get('price'), sku.get('num'));
            } else {
              //大于等于可退数量 , 使用分摊小计金额 - 已退金额(单价*(购买数量-可退数量))
              return QMFloat.accSubtr(
                sku.get('splitPrice'),
                QMFloat.accMul(
                  sku.get('price'),
                  QMFloat.accSubtr(sku.get('totalNum'), sku.get('canReturnNum'))
                )
              );
            }
          })
          .reduce((one, two) => QMFloat.accAdd(one, two))
      : data.getIn(['tradeDetail', 'tradePrice', 'totalPrice']);

    const tradeDetail = data.get('tradeDetail');

    // 可退积分
    let shouldIntegral;
    // true为退款申请，否则为退货申请
    if (!data.get('isReturn')) {
      shouldIntegral =
        tradeDetail.getIn(['tradePrice', 'points']) == null
          ? 0
          : tradeDetail.getIn(['tradePrice', 'points']);
    } else {
      shouldIntegral =
        tradeDetail.getIn(['tradePrice', 'points']) == null
          ? 0
          : tradeDetail
              .get('tradeItems')
              .filter((sku) => sku.get('num') > 0)
              .map((sku) => {
                if (sku.get('num') < sku.get('canReturnNum')) {
                  // 小于可退数量,直接均摊积分乘以数量
                  return Math.floor(
                    QMFloat.accMul(sku.get('skuPoint'), sku.get('num'))
                  );
                } else {
                  // 大于等于可退数量 , 使用积分 - 已退积分(均摊积分*(购买数量-可退数量))
                  return Math.floor(
                    QMFloat.accSubtr(
                      sku.get('points') || 0,
                      Math.floor(
                        QMFloat.accMul(
                          sku.get('skuPoint'),
                          QMFloat.accSubtr(
                            sku.get('totalNum'),
                            sku.get('canReturnNum')
                          )
                        )
                      )
                    )
                  );
                }
              })
              .reduce((one, two) => one + two) || 0;
    }

    param = param.set('returnPrice', {
      applyStatus: data.get('applyStatus'),
      applyPrice: data.get('applyPrice'),
      totalPrice: totalPrice
    });
    param = param.set('returnPoints', {
      applyPoints: shouldIntegral
    });

    // 退款金额大于可退金额时
    if (
      data.get('applyStatus')
        ? data.get('applyPrice') > data.get('canApplyPrice')
        : totalPrice > data.get('canApplyPrice')
    ) {
      console.log( );
      //  || data.get('canApplyPrice') > 0
      if(data.toJS().tradeDetail.activityType != '1') {
        // 在线支付要判断退款金额不能大于剩余退款金额
      if (data.get('isOnLine')) {
        Modal.warning({
          title: `该订单剩余可退金额为：￥${data.get('canApplyPrice')}`,
          content: '退款金额不可大于可退金额，请修改',
          okText: '确定'
        });
        return;
      } else {
        let onAdd = this.onAdd;
        // 线下，给出提示
        confirm({
          title: `该订单剩余可退金额为：￥${data.get('canApplyPrice')}`,
          content: '当前退款金额超出了可退金额，是否继续？',
          onOk() {
            return onAdd(param);
          },
          onCancel() {},
          okText: '继续',
          cancelText: '关闭'
        });
        return;
      }
      }
    }
  console.log('10239');
  
    return this.onAdd(param);
  };

  onAdd = async (param) => {
    let result;
    result = await addApply(param.toJS());

    if (result.res.code == Const.SUCCESS_CODE) {
      message.success('新增退单成功');
      history.push('/th_order-return-list');
    } else {
      message.error(result.res.message);
      return;
    }
  };
}
