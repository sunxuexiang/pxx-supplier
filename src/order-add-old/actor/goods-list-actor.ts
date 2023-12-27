import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';

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
      discountPrice: '0.00',
      //满减金额
      reductionPrice: '0.00',
      //原先的订单金额数据
      oldTradePrice: {}
    };
  }

  @Action('goodsList:select')
  select(state: IMap, dataSource) {
    return state.setIn(['goodsList', 'dataSource'], fromJS(dataSource));
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
   * 修改促销活动
   * @param state
   * @param goodsInfoId
   * @param marketingId
   * @returns {Map<K, V>}
   */
  @Action('goodsList:changeMarketing')
  changeMarketing(state: IMap, { goodsInfoId, marketingId }) {
    const index = state
      .getIn(['goodsList', 'dataSource'])
      .findIndex((sku) => sku.get('goodsInfoId') == goodsInfoId);
    return state.setIn(
      ['goodsList', 'dataSource', index, 'marketingId'],
      marketingId
    );
  }

  /**
   * 勾选赠品
   */
  @Action('goodsList:checkGift')
  checkGift(
    state: IMap,
    { marketingId, giftLevelId, giftDetailId, giftId, checked }
  ) {
    // 1.查找勾选的赠品在giftMarketings中的位置信息
    const marketingIndex = state
      .get('giftMarketings')
      .findIndex((marketing) => marketing.get('marketingId') == marketingId);
    const levelIndex = state
      .getIn(['giftMarketings', marketingIndex, 'fullGiftLevelList'])
      .findIndex((level) => level.get('giftLevelId') == giftLevelId);
    const giftIndex = state
      .getIn([
        'giftMarketings',
        marketingIndex,
        'fullGiftLevelList',
        levelIndex,
        'fullGiftDetailList'
      ])
      .findIndex((gift) => {
        if (giftDetailId) return gift.get('giftDetailId') == giftDetailId;
        if (giftId) return gift.get('productId') == giftId;
      });

    // 2.判断赠品是否可勾选
    if (checked) {
      // 判断单选level是否被复选
      const level = state.getIn([
        'giftMarketings',
        marketingIndex,
        'fullGiftLevelList',
        levelIndex
      ]);
      const levelChecked = !level
        .get('fullGiftDetailList')
        .filter((gift) => gift.get('checked'))
        .isEmpty();
      if (level.get('giftType') == 1 && levelChecked) {
        message.error('只可选择1种赠品哦~');
        return state;
      }
      // 判断是否选择了多个level
      const levels = state.getIn([
        'giftMarketings',
        marketingIndex,
        'fullGiftLevelList'
      ]);
      const marketingChecked = !levels
        .filter(
          (level) =>
            !level
              .get('fullGiftDetailList')
              .filter((gift) => gift.get('checked'))
              .isEmpty()
        )
        .isEmpty();
      if (marketingChecked && !levelChecked) {
        message.error('只可参加1个满赠活动哦~');
        return state;
      }
    }

    // 3.修改giftMarketings中赠品的勾选状态（改变领取赠品气泡框中相应赠品勾选状态）
    state = state.setIn(
      [
        'giftMarketings',
        marketingIndex,
        'fullGiftLevelList',
        levelIndex,
        'fullGiftDetailList',
        giftIndex,
        'checked'
      ],
      checked
    );

    // 4.修改giftDataSource中相应赠品信息（改变已领取赠品列表中相应赠品状态）
    const gift = state.getIn([
      'giftMarketings',
      marketingIndex,
      'fullGiftLevelList',
      levelIndex,
      'fullGiftDetailList',
      giftIndex
    ]);
    const giftInfo = state
      .getIn(['marketingGiftList', marketingId])
      .find((item) => item.get('goodsInfoId') == gift.get('productId'));
    let giftDataSource = state.getIn(['goodsList', 'giftDataSource']);
    const checkGiftIndex = giftDataSource.findIndex(
      (item) => item.get('goodsInfoId') == giftInfo.get('goodsInfoId')
    );
    const checkGift = giftDataSource.get(checkGiftIndex);
    if (checked) {
      //如果为勾选
      if (checkGiftIndex != -1) {
        //如果之前选过该赠品，则加数量
        giftDataSource = giftDataSource.setIn(
          [checkGiftIndex, 'count'],
          checkGift.get('count') + gift.get('productNum')
        );
      } else {
        //否则添加赠品至列表
        giftDataSource = giftDataSource.push(
          giftInfo.set('count', gift.get('productNum')).set('gift', true) //标识赠品行
        );
      }
    } else {
      //如果为取消勾选
      let count = checkGift.get('count') - gift.get('productNum');
      if (count == 0) {
        //如果商品数为0，则删除
        giftDataSource = giftDataSource.remove(checkGiftIndex);
      } else {
        //否则减数量
        giftDataSource = giftDataSource.setIn([checkGiftIndex, 'count'], count);
      }
    }
    state = state.setIn(['goodsList', 'giftDataSource'], giftDataSource);

    return state;
  }

  /**
   * 根据商品Id删除选中的赠品
   */
  @Action('goodsList:delGift')
  delGift(state: IMap, goodsInfoId) {
    //1.删除giftDataSource中相应赠品（已领取赠品列表中相应赠品删除）
    state = state.setIn(
      ['goodsList', 'giftDataSource'],
      state
        .getIn(['goodsList', 'giftDataSource'])
        .filter((item) => item.get('goodsInfoId') != goodsInfoId)
    );

    //2.将giftMarketings下相关gift勾选状态取消（取消赠品气泡框中已勾选的赠品）
    state = state.set(
      'giftMarketings',
      state.get('giftMarketings').map((marketing) =>
        marketing.set(
          'fullGiftLevelList',
          marketing.get('fullGiftLevelList').map((level) =>
            level.set(
              'fullGiftDetailList',
              level.get('fullGiftDetailList').map((gift) => {
                if (gift.get('productId') == goodsInfoId) {
                  return gift.set('checked', false);
                }
                return gift;
              })
            )
          )
        )
      )
    );

    return state;
  }

  /**
   * 设置满赠活动赠品详细信息
   */
  @Action('goodsList:setGiftList')
  setGiftList(state: IMap, { giftList, marketingId }) {
    return state.setIn(['marketingGiftList', marketingId], giftList);
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
  editInit(state: IMap, { tradePrice, goodsInfos, goodsIntervalPrices }) {
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
      .set('oldTradePrice', tradePrice);
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
   * 重新设置满足条件的赠品活动
   * 同时保留满足新条件的已选赠品
   * @param {IMap} state
   * @param giftMarketings
   * @returns {Map<string, any>}
   */
  @Action('goodsList:setGiftMarketings')
  setGiftMarketings(state: IMap, newGiftMarketings) {
    //从赠品列表中删除赠品
    const delGiftFromDataSource = (gift) => {
      let giftDataSource = state.getIn(['goodsList', 'giftDataSource']);
      const checkGiftIndex = giftDataSource.findIndex(
        (item) => item.get('goodsInfoId') == gift.get('productId')
      );
      const checkGift = giftDataSource.get(checkGiftIndex);
      let count = checkGift.get('count') - gift.get('productNum');
      if (count == 0) {
        //如果商品数为0，则删除
        giftDataSource = giftDataSource.remove(checkGiftIndex);
      } else {
        //否则减数量
        giftDataSource = giftDataSource.setIn([checkGiftIndex, 'count'], count);
      }
      state = state.setIn(['goodsList', 'giftDataSource'], giftDataSource);
    };

    //1.将满足条件的已选赠品check状态保留，将不满足的从giftMarketings删除
    newGiftMarketings = newGiftMarketings.map((marketing) =>
      marketing.set(
        'fullGiftLevelList',
        marketing.get('fullGiftLevelList').map((level) =>
          level.set(
            'fullGiftDetailList',
            level.get('fullGiftDetailList').map((gift) => {
              //判断赠品所处等级是否可编辑
              let oldMarketing = state
                .get('giftMarketings')
                .find(
                  (oldMarketing) =>
                    oldMarketing.get('marketingId') ==
                    marketing.get('marketingId')
                );
              if (oldMarketing) {
                const checked = oldMarketing
                  .get('fullGiftLevelList')
                  .find(
                    (oldLevel) =>
                      oldLevel.get('giftLevelId') == level.get('giftLevelId')
                  )
                  .get('fullGiftDetailList')
                  .find(
                    (oldGift) =>
                      oldGift.get('giftDetailId') == gift.get('giftDetailId')
                  )
                  .get('checked');
                if (checked) {
                  if (level.get('edit')) {
                    //如果等级可编辑且之前已选，则保留
                    return gift.set('checked', true);
                  } else {
                    //如果等级不可编辑但之前已选，则删除giftDataSource里的记录
                    delGiftFromDataSource(gift);
                  }
                }
              }
              return gift;
            })
          )
        )
      )
    );

    //2.将不满足条件的营销关联的赠品从giftMarketings删除
    state.get('giftMarketings').forEach((oldMarketing) => {
      const include = newGiftMarketings
        .map((item) => item.get('marketingId'))
        .includes(oldMarketing.get('marketingId'));
      if (!include) {
        //如果旧营销已经不满足
        oldMarketing
          .get('fullGiftLevelList')
          .reduce((a, b) => a.concat(b.get('fullGiftDetailList')), fromJS([]))
          .forEach((gift) => {
            if (gift.get('checked')) delGiftFromDataSource(gift);
          });
      }
    });

    return state.set('giftMarketings', newGiftMarketings);
  }

  /**
   * 设置满足条件的其它活动
   */
  @Action('goodsList:setOtherMarketings')
  setOtherMarketings(state: IMap, otherMarketings) {
    return state.set('otherMarketings', otherMarketings);
  }

  /**
   * 设置满减金额
   */
  @Action('goodsList:setReductionPrice')
  setReductionPrice(state: IMap, reductionPrice) {
    return state.set('reductionPrice', reductionPrice);
  }

  /**
   * 设置满折金额
   */
  @Action('goodsList:setDiscountPrice')
  setDiscountPrice(state: IMap, discountPrice) {
    return state.set('discountPrice', discountPrice);
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
   * 设置支付金额
   */
  @Action('goodsList:setPayTotal')
  setPayTotal(state: IMap, payTotal) {
    return state.setIn(['goodsList', 'payTotal'], payTotal);
  }
}
