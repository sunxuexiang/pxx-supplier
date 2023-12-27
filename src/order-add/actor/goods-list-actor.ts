import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class GoodsListActor extends Actor {
  defaultState() {
    return {
      goodsList: {
        //开启运费
        isEnableDeliverFee: false,
        //运费
        deliverFee: 0,
        //开启特价
        isEnableSpecVal: false,
        //特价
        specVal: 0,
        dataSource: fromJS([]),
        //已选赠品列表
        giftDataSource: fromJS([]),
        //商品区间价
        goodsIntervalPrices: fromJS([]),
        //商品总金额
        totalMoney: '0.00',
        //支付金额
        payTotal: '0.00'
      },
      //原有订单商品Id
      oldSkuIds: fromJS([]),
      //新增商品Id
      newSkuIds: fromJS([]),
      //原始订单中的商品购买数量
      oldBuyCount: fromJS([]),
      //满赠活动赠品详细信息map，结构{ marketingId - list<GiftInfo> }
      marketingGiftList: {},
      //满足条件的满赠活动，同时记录领取的赠品
      giftMarketings: fromJS([]),
      //满足条件的其它活动（满折、满减）
      otherMarketings: fromJS([]),
      //满折金额
      discountPrice: 0,
      //优惠券金额
      couponPrice: 0,
      //积分抵扣金额
      pointsPrice: 0,
      //满减金额
      reductionPrice: 0,
      //原先的订单金额数据
      oldTradePrice: {}
    };
  }

  @Action('goodsList:select')
  select(state: IMap, dataSource) {
    return state.setIn(['goodsList', 'dataSource'], fromJS(dataSource));
  }
  @Action('goodsList:couponCodeIds')
  couponCodeId(state: IMap, couponCodeIds) {
    return state.setIn(['goodsList', 'couponCodeIds'], fromJS(couponCodeIds));
  }

  /**
   * 根据goodsInfoId删除state存储的goods信息
   * @param state
   * @param goodsInfoId
   * @returns {Map<K, V>}
   */
  @Action('goodsList:delete')
  deleteByIndex(state: IMap, goodsInfoId: string) {
    let dataSource = state.getIn(['goodsList', 'dataSource']);
    const oldSkuIds = state
      .get('oldSkuIds')
      .filter((skuId) => skuId != goodsInfoId);
    const newSkuIds = state
      .get('newSkuIds')
      .filter((skuId) => skuId != goodsInfoId);
    dataSource = dataSource.filter(
      (sku) => sku.get('goodsInfoId') != goodsInfoId
    );
    return state
      .setIn(['goodsList', 'dataSource'], dataSource)
      .set('oldSkuIds', oldSkuIds)
      .set('newSkuIds', newSkuIds);
  }

  @Action('goodsList:enableSpecVal')
  enableSpecVal(state: IMap, enable: boolean) {
    if (enable) {
      state = state.setIn(
        ['goodsList', 'specVal'],
        +state.getIn(['goodsList', 'payTotal']) -
          state.getIn(['goodsList', 'deliverFee'])
      );
    }
    return state.setIn(['goodsList', 'isEnableSpecVal'], enable);
  }

  @Action('goodsList:changeSpecVal')
  changeSpecVal(state: IMap, price: number) {
    return state.setIn(['goodsList', 'specVal'], price);
  }

  @Action('goodsList:enableDeliverFee')
  enableDeliverFee(state: IMap, checked: boolean) {
    return state.setIn(['goodsList', 'isEnableDeliverFee'], checked);
  }

  @Action('goodsList:changeDeliverFee')
  changeDeliverFee(state: IMap, price: number) {
    return state.setIn(['goodsList', 'deliverFee'], price);
  }

  /**
   * 根据goodsInfoId修改商品数量
   * @param state
   * @param goodsInfoId
   * @param num
   * @returns {Map<K, V>}
   */
  @Action('goodsList:buyCount')
  buyCount(state: IMap, { goodsInfoId, num }) {
    const index = state
      .getIn(['goodsList', 'dataSource'])
      .findIndex((sku) => sku.get('goodsInfoId') == goodsInfoId);
    return state.setIn(['goodsList', 'dataSource', index, 'buyCount'], num);
  }

  /**
   * 清除商品信息
   * @param state
   * @returns {Map<K, V>}
   */
  @Action('goodsList:clear')
  clear(state: IMap) {
    return state
      .setIn(['goodsList', 'dataSource'], fromJS([]))
      .setIn(['goodsList', 'isEnableDeliverFee'], false)
      .setIn(['goodsList', 'deliverFee'], 0)
      .setIn(['goodsList', 'isEnableSpecVal'], false)
      .setIn(['goodsList', 'specVal'], 0)
      .set('oldSkuIds', fromJS([]))
      .set('newSkuIds', fromJS([]))
      .set('oldBuyCount', fromJS([]))
      .setIn(['goodsList', 'giftDataSource'], fromJS([]))
      .setIn(['goodsList', 'goodsIntervalPrices'], fromJS([]))
      .setIn(['goodsList', 'totalMoney'], '0.00')
      .setIn(['goodsList', 'payTotal'], '0.00')
      .set('giftMarketings', fromJS([]));
  }

  /**
   * 编辑订单商品模块信息初始化
   * @param state
   * @param tradePrice
   * @returns {Map<K, V>}
   */
  @Action('goodsList:edit:init')
  editInit(
    state: IMap,
    { tradePrice, goodsInfos, goodsIntervalPrices, gifts, detail }
  ) {
    const discountPrice = tradePrice.getIn(['discount', 'discounts']);
    const reductionPrice = tradePrice.getIn(['reduction', 'discounts']);
    return state
      .setIn(['goodsList', 'isEnableSpecVal'], tradePrice.get('special'))
      .setIn(['goodsList', 'deliverFee'], tradePrice.get('deliveryPrice'))
      .setIn(
        ['goodsList', 'isEnableDeliverFee'],
        tradePrice.get('enableDeliveryPrice')
      )
      .setIn(['goodsList', 'specVal'], tradePrice.get('privilegePrice'))
      .setIn(['goodsList', 'dataSource'], goodsInfos)
      .setIn(['goodsList', 'goodsIntervalPrices'], goodsIntervalPrices)
      .setIn(['goodsList', 'totalMoney'], tradePrice.get('goodsPrice'))
      .setIn(['goodsList', 'payTotal'], tradePrice.get('totalPrice'))
      .set('oldTradePrice', tradePrice)
      .set('discountPrice', discountPrice ? discountPrice : 0)
      .set('couponPrice', tradePrice.get('couponPrice'))
      .set(
        'pointsPrice',
        tradePrice.get('pointsPrice') ? tradePrice.get('pointsPrice') : 0
      )
      .set('reductionPrice', reductionPrice ? reductionPrice : 0)
      .setIn(['goodsList', 'giftDataSource'], gifts)
      .set('detail', detail);
  }

  /**
   * 编辑订单初始化--保存订单中skuIds
   * @param state
   * @param skuIds
   * @returns {Map<string, V>}
   */
  @Action('goodsList:oldSkuIds')
  oldSkuIds(state: IMap, skuIds) {
    return state.set('oldSkuIds', skuIds);
  }

  /**
   * 新增商品
   * @param state
   * @param skuIds
   * @returns {Map<string, V>}
   */
  @Action('goodsList:newSkuIds')
  newSkuIds(state: IMap, skuIds) {
    return state.set('newSkuIds', skuIds);
  }

  /**
   * 编辑订单保存之前订单中商品购买数量
   * @param state
   * @param oldBuyCount
   * @returns {Map<string, V>}
   */
  @Action('goodsList:oldBuyCount')
  oldBuyCount(state: IMap, oldBuyCount) {
    return state.set('oldBuyCount', oldBuyCount);
  }

  /**
   * 设置商品区间价
   */
  @Action('goodsList:setGoodsIntervalPrices')
  setGoodsIntervalPrices(state: IMap, goodsIntervalPrices) {
    return state.setIn(
      ['goodsList', 'goodsIntervalPrices'],
      goodsIntervalPrices
    );
  }

  /**
   * 设置商品总金额
   */
  @Action('goodsList:setTotalMoney')
  setTotalMoney(state: IMap, totalMoney) {
    return state.setIn(['goodsList', 'totalMoney'], totalMoney);
  }
  /**
   * 设置优惠赠品
   */
  @Action('setetradeMarketingList')
  setetradeMarketingList(state: IMap, tradeMarketingList) {
    return state.set('tradeMarketingList', tradeMarketingList);
  }

  /**
   * 设置支付金额
   */
  @Action('goodsList:setPayTotal')
  setPayTotal(state: IMap, payTotal) {
    return state.setIn(['goodsList', 'payTotal'], payTotal);
  }
}
