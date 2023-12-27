import { Store } from 'plume2';
import FormModalActor from './actor/form-modal-actor';
import CustomerActor from './actor/customer-actor';
import DeliveryAddressActor from './actor/delivery-address-actor';
import GoodsListActor from './actor/goods-list-actor';
import ExtraInfoActor from './actor/extra-info-actor';
import OrderActor from './actor/order-actor';
import { message, Modal } from 'antd';
import * as webapi from './webapi';
import { fromJS, List } from 'immutable';
import { IList } from 'typings/globalType';
import { Const, FindArea, history, QMFloat, QMMethod } from 'qmkit';
import moment from 'moment';

const confirm = Modal.confirm;

export default class AppStore extends Store {
  freightFunc = QMMethod.delayFunc(() => {
    this._calcFreight();
  }, 500);

  bindActor() {
    return [
      new FormModalActor(),
      new CustomerActor(),
      new DeliveryAddressActor(),
      new GoodsListActor(),
      new ExtraInfoActor(),
      new OrderActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = (res) => {
    //获取用户
    this.dispatch('customer:init', res);
  };

  /**
   * 计算运费
   */
  _calcFreight = () => {
    if (
      this.state()
        .get('goodsList')
        .get('isEnableDeliverFee')
    ) {
      this.calcPayTotal();
      return false;
    }

    const selectedAddrId = this.state().get('selectedAddrId');

    let consignee;
    //1.组装收货地址
    if (selectedAddrId == 'tempId') {
      const consigneeTemp = this.state().get('consignee');
      if (!consigneeTemp || !consigneeTemp.get('provinceId')) {
        this.calcPayTotal();
        //选择临时地址,却未填写,则不计算运费
        return false;
      }
      consignee = {
        provinceId: consigneeTemp.get('provinceId'),
        cityId: consigneeTemp.get('cityId')
      };
    } else {
      const addrs = this.state().get('addrs');
      const selectedAddrId = this.state().get('selectedAddrId');
      const consigneeSel = addrs.find(
        (address) => address.get('deliveryAddressId') == selectedAddrId
      );
      if (!consigneeSel || !consigneeSel.get('provinceId')) {
        this.calcPayTotal();
        //选择得用户，目前没有任何收获地址，也没有选中临时地址
        return false;
      }
      consignee = {
        provinceId: consigneeSel.get('provinceId'),
        cityId: consigneeSel.get('cityId')
      };
    }

    //把营销中的包含均摊价的商品 替代 原商品
    const others = this.state()
      .get('otherMarketings')
      .flatMap((m) => m.get('goodsInfos'));
    const goodsList = this.state()
      .get('goodsList')
      .get('dataSource')
      .map((g) => {
        const goodsInfo = others.find(
          (o) => o.get('goodsInfoId') == g.get('goodsInfoId')
        );

        if (goodsInfo && goodsInfo.get('goodsInfoId')) {
          return goodsInfo
            .set('num', goodsInfo.get('buyCount'))
            .set('skuId', goodsInfo.get('goodsInfoId'));
        } else {
          const splitPrice = g.get('splitPrice')
            ? g.get('splitPrice')
            : QMFloat.accMul(g.get('salePrice'), g.get('buyCount'));
          return g
            .set('num', g.get('buyCount'))
            .set('skuId', g.get('goodsInfoId'))
            .set('splitPrice', splitPrice);
        }
      });

    if (!goodsList || !goodsList.size) {
      this.dispatch('goodsList:changeDeliverFee', 0);
      this.calcPayTotal();
      return false;
    }

    const tradeParams = {
      consignee,
      deliverWay: this.state()
        .get('extra')
        .get('deliverWay'),
      tradePrice: {
        totalPrice: QMFloat.accSubtr(
          QMFloat.accSubtr(
            this.state()
              .get('goodsList')
              .get('totalMoney'),
            this.state().get('discountPrice')
          ),
          this.state().get('reductionPrice')
        )
      },
      oldTradeItems: goodsList.toJS(),
      oldGifts: this.state()
        .get('goodsList')
        .get('giftDataSource')
        .map((g) =>
          g.set('num', g.get('count')).set('skuId', g.get('goodsInfoId'))
        )
        .toJS()
    };

    return webapi.fetchFreight(tradeParams).then((r) => {
      this.dispatch('goodsList:changeDeliverFee', r.res.context.deliveryPrice);
      this.calcPayTotal();
    });
  };

  /**
   * 计算并设置商品金额
   */
  calcTotalMoney = () => {
    const goodsList = this.state().get('goodsList');
    const goodsIntervalPrices = this.state().getIn([
      'goodsList',
      'goodsIntervalPrices'
    ]);
    const dataSource = goodsList.get('dataSource');
    const totalMoney = (
      dataSource.reduce((a, b) => {
        let price = b.get('salePrice');
        if (b.get('priceType') === 1) {
          const buyCount = b.get('buyCount');
          if (!goodsIntervalPrices) {
            return 0;
          }
          const prices = fromJS(b.get('intervalPriceIds') || [])
            .map((id) =>
              goodsIntervalPrices
                .filter((price) => price && price.get('intervalPriceId') == id)
                .first()
            )
            .filter((f) => f && f.get('count') <= buyCount)
            .maxBy((f) => f.get('count'));
          if (prices) {
            price = prices.get('price');
          }
        }
        a = QMFloat.accAdd(QMFloat.accMul(price, b.get('buyCount')), a);
        return a;
      }, 0) || 0
    ).toFixed(2);
    this.dispatch('goodsList:setTotalMoney', totalMoney);
  };

  /**
   * 计算并设置支付金额
   */
  calcPayTotal = () => {
    let payTotal = '';
    const goodsList = this.state().get('goodsList');
    //商品金额
    const totalMoney = this.state().getIn(['goodsList', 'totalMoney']);
    //满折、满减金额
    const discountPrice = this.state().get('discountPrice');
    const reductionPrice = this.state().get('reductionPrice');
    let deliverFee = goodsList.get('deliverFee').toFixed(2);
    //特价
    const isEnableSpecVal = goodsList.get('isEnableSpecVal');
    const specVal = goodsList.get('specVal') || 0.0;
    if (isEnableSpecVal) {
      payTotal = QMFloat.accAdd(specVal, deliverFee).toFixed(2);
    } else {
      payTotal = QMFloat.addZero(
        QMFloat.accSubtr(
          QMFloat.accAdd(deliverFee, totalMoney),
          QMFloat.accAdd(discountPrice, reductionPrice)
        )
      );
    }
    this.dispatch('goodsList:setPayTotal', payTotal);
  };

  /**
   * 计算并设置营销信息
   */
  calcMarketings = () => {
    const goodsList = this.state().get('goodsList');
    const goodsIntervalPrices = this.state().getIn([
      'goodsList',
      'goodsIntervalPrices'
    ]);
    let dataSource = goodsList.get('dataSource');

    // 1.计算每个商品的会员价，同时将商品按营销活动分组
    let marketings = fromJS([]);
    dataSource = dataSource.map((rowInfo) => {
      // 计算每个商品的会员价
      // 如果商品按订货量设价，则根据价格区间计算会员价
      // 这边只是处理按订货量设价的情况，其它情况的会员价后台已经计算好了
      let price = rowInfo.get('salePrice');
      const buyCount = rowInfo.get('buyCount');
      if (rowInfo.get('priceType') === 1) {
        const prices = rowInfo
          .get('intervalPriceIds')
          .map((id) =>
            goodsIntervalPrices
              .filter((price) => price.get('intervalPriceId') == id)
              .first()
          )
          .filter((f) => f && f.get('count') <= buyCount)
          .maxBy((f) => f.get('count'));
        if (prices) {
          price = prices.get('price');
        }
      }
      rowInfo = rowInfo
        .set('salePrice', price)
        .set('splitPrice', price * buyCount);
      // 将商品按营销活动分组
      let skuMarketings = rowInfo.get('marketings');
      if (skuMarketings) {
        let selMarketing = skuMarketings.find(
          (marketing) =>
            marketing.get('marketingId') == rowInfo.get('marketingId')
        );
        let index = marketings.findIndex(
          (marketing) =>
            marketing.get('marketingId') == rowInfo.get('marketingId')
        );
        if (index != -1) {
          marketings = marketings.updateIn([index, 'goodsInfos'], (goodsInfo) =>
            goodsInfo.push(rowInfo)
          );
        } else {
          marketings = marketings.push(
            selMarketing.merge({
              goodsInfos: List([rowInfo])
            })
          );
        }
      }
      return rowInfo;
    });

    // 2.计算满减总金额、满折总金额、满足条件的满赠活动
    //   遍历每个营销活动，根据活动类型计算相应活动的满足情况
    //   累加满金额减、满数量减的金额成满减总金额
    //   累加满金额折、满数量折的金额成满折总总额
    //   保存满足条件的满赠活动的情况
    let reductionPrice = 0,
      discountPrice = 0;
    let newGiftMarketings = fromJS([]);
    let levels;
    marketings = marketings.map((marketing) => {
      let priceTmp = 0; //营销活动优惠金额(不论满折,还是满减)
      let prices = 0,
        count = 0;
      marketing.get('goodsInfos').forEach((value) => {
        count = QMFloat.accAdd(value.get('buyCount'), count);
        prices = QMFloat.accAdd(
          QMFloat.accMul(value.get('salePrice'), value.get('buyCount')),
          prices
        );
      });
      switch (marketing.get('subType')) {
        case 0: //满金额减
          levels = marketing
            .get('fullReductionLevelList')
            .filter((level) => level.get('fullAmount') <= prices)
            .sort((l1, l2) => l1.get('fullAmount') > l2.get('fullAmount'));
          if (!levels.isEmpty()) {
            priceTmp = levels.last().get('reduction');
            reductionPrice = QMFloat.accAdd(reductionPrice, priceTmp);
            marketing = marketing.set(
              'marketingLevelId',
              levels.last().get('reductionLevelId')
            );
          }
          break;
        case 1: //满数量减
          levels = marketing
            .get('fullReductionLevelList')
            .filter((level) => level.get('fullCount') <= count)
            .sort((l1, l2) => l1.get('fullCount') > l2.get('fullCount'));
          if (!levels.isEmpty()) {
            priceTmp = levels.last().get('reduction');
            priceTmp = priceTmp > prices ? prices : priceTmp;
            reductionPrice = QMFloat.accAdd(reductionPrice, priceTmp);
            marketing = marketing.set(
              'marketingLevelId',
              levels.last().get('reductionLevelId')
            );
          }
          break;
        case 2: //满金额折
          levels = marketing
            .get('fullDiscountLevelList')
            .filter((level) => level.get('fullAmount') <= prices)
            .sort((l1, l2) => l1.get('fullAmount') > l2.get('fullAmount'));
          if (!levels.isEmpty()) {
            priceTmp = QMFloat.accSubtr(
              prices,
              QMFloat.accMul(prices, levels.last().get('discount'))
            );
            discountPrice = QMFloat.accAdd(discountPrice, priceTmp);
            marketing = marketing.set(
              'marketingLevelId',
              levels.last().get('discountLevelId')
            );
          }
          break;
        case 3: //满数量折
          levels = marketing
            .get('fullDiscountLevelList')
            .filter((level) => level.get('fullCount') <= count)
            .sort((l1, l2) => l1.get('fullCount') > l2.get('fullCount'));
          if (!levels.isEmpty()) {
            priceTmp = QMFloat.accSubtr(
              prices,
              QMFloat.accMul(prices, levels.last().get('discount'))
            );
            discountPrice = QMFloat.accAdd(discountPrice, priceTmp);
            marketing = marketing.set(
              'marketingLevelId',
              levels.last().get('discountLevelId')
            );
          }
          break;
        case 4: //满金额赠
          levels = marketing
            .get('fullGiftLevelList')
            .map((level) => {
              if (level.get('fullAmount') <= prices)
                return level.set('edit', true);
              return level;
            })
            .sort((l1, l2) => l1.get('fullAmount') > l2.get('fullAmount'));
          if (levels.first().get('edit')) {
            newGiftMarketings = newGiftMarketings.push(
              marketing.set('fullGiftLevelList', levels)
            );
          }
          break;
        case 5: //满数量赠
          levels = marketing
            .get('fullGiftLevelList')
            .map((level) => {
              if (level.get('fullCount') <= count)
                return level.set('edit', true);
              return level;
            })
            .sort((l1, l2) => l1.get('fullCount') > l2.get('fullCount'));
          if (levels.first().get('edit')) {
            newGiftMarketings = newGiftMarketings.push(
              marketing.set('fullGiftLevelList', levels)
            );
          }
          break;
      }
      //计算商品的营销均摊价
      return marketing.set(
        'goodsInfos',
        this._calcSplitPrice(
          marketing.get('goodsInfos'),
          QMFloat.accSubtr(prices, Math.round(priceTmp * 100) / 100)
        )
      );
    });
    const giftMarketingIds = newGiftMarketings.map((item) =>
      item.get('marketingId')
    );
    this.dispatch(
      'goodsList:setOtherMarketings',
      marketings.filter(
        (item) => !giftMarketingIds.contains(item.get('marketingId'))
      )
    );
    this.dispatch('goodsList:setGiftMarketings', newGiftMarketings);
    this.dispatch('goodsList:setReductionPrice', reductionPrice.toFixed(2));
    this.dispatch('goodsList:setDiscountPrice', discountPrice.toFixed(2));
  };

  _calcSplitPrice = (tradeItems, newTotal) => {
    //为空或为零
    if (!newTotal) {
      return tradeItems.map((tradeItem) => tradeItem.set('splitPrice', 0));
    }

    const total = tradeItems
      .map((item) => item.get('splitPrice'))
      .reduce((a, b) => QMFloat.accAdd(a, b), 0);

    //内部总价为零或相等不用修改
    if (total == 0 || total == newTotal) {
      return tradeItems;
    }

    const size = tradeItems.size;
    let splitPriceTotal = 0; //累积平摊价，将剩余扣给最后一个元素
    return tradeItems.map((tradeItem, i) => {
      if (i == size - 1) {
        return tradeItem.set(
          'splitPrice',
          QMFloat.accSubtr(newTotal, splitPriceTotal)
        );
      } else {
        const herePrice =
          Math.round(
            Math.floor(tradeItem.get('splitPrice') / total * 1000000) /
              1000000 *
              newTotal *
              100
          ) / 100;
        splitPriceTotal = QMFloat.accAdd(splitPriceTotal, herePrice);
        return tradeItem.set('splitPrice', herePrice);
      }
    });
  };

  initInvoiceSwitch = () => {
    //查询开票配置信息
    webapi.fetchInvoiceSwitch().then((invoiceSwitch) => {
      if (invoiceSwitch.res.code == Const.SUCCESS_CODE) {
        this.dispatch('setInvoiceSwitch', invoiceSwitch.res.context);
      }
    });
  };

  /**
   * 订单详情
   * @param tid
   * @returns {Promise<void>}
   */
  editInit = async (tid: string) => {
    //获取订单详情
    const { res: orderRes } = (await webapi.fetchOrderDetail(tid)) as any;
    let { code, context: orderInfo, message: orderError } = orderRes;

    if (code != Const.SUCCESS_CODE) {
      message.error(orderError);
      return;
    }

    const detail = fromJS(orderInfo);
    const tradeState = detail.get('tradeState');
    if (tradeState.get('flowState') == 'VOID') {
      message.error('订单已作废，不能修改订单！');
      history.push('/order-list');
      return;
    }
    //购买者
    const buyer = detail.get('buyer');
    //买家当前信息
    const { res: newBuyer } = await webapi.fetchSingleCustomer(buyer.get('id'));
    if (!newBuyer || !fromJS(newBuyer).get('customerId')) {
      message.error('客户已被删除，不能修改订单！');
      history.push('/order-list');
      return;
    }

    // 营销失效信息提醒
    // 查询当前商品进行中的营销，从订单营销中过滤出失效营销并进行提示
    const tradeMarketings = detail.get('tradeMarketings');
    let startingMarketings = fromJS([]);
    if (tradeMarketings && tradeMarketings.size > 0) {
      const {
        res: { context: startingMarketingsRes }
      } = (await webapi.fetchStartingMarketing({
        marketingIds: tradeMarketings.map((marketing) =>
          marketing.get('marketingId')
        )
      })) as any;
      startingMarketings = fromJS(startingMarketingsRes)
        ? fromJS(startingMarketingsRes)
        : fromJS([]);
      const invalidMarketings = tradeMarketings.filter(
        (marketing) =>
          !startingMarketings.includes(marketing.get('marketingId'))
      );
      if (invalidMarketings.size > 0) {
        confirm({
          title: '优惠失效提醒',
          content: `很抱歉${invalidMarketings.reduce(
            (a, b) => `${a}，${b.get('marketingName')}`,
            ''
          )}活动已失效！`,
          okText: '继续修改',
          cancelText: '放弃修改',
          onCancel() {
            // 放弃修改，返回订单列表
            history.push('/order-list');
          }
        });
      }
    }

    //收货人信息
    let consignee = detail.get('consignee');
    let customerTempAddressVisiable = false;
    if (!consignee.get('id') && consignee.get('areaId')) {
      customerTempAddressVisiable = true;
      consignee = consignee.set('id', 'tempId');
    }

    //交易金额
    let tradePrice = detail.get('tradePrice');
    //用户id
    const accoutId = buyer.get('id');
    //订单发票信息
    let orderInvoice = detail.get('invoice');

    //发票使用临时地址的逻辑
    let customerInvoiceTempAddressVisiable = false;
    if (!orderInvoice.get('addressId') && orderInvoice.get('provinceId')) {
      customerInvoiceTempAddressVisiable = true;
      orderInvoice = orderInvoice
        .set('addressId', 'tempId')
        .set('name', orderInvoice.get('contacts'));
    }
    //订单商品项
    const tradeItems = detail.get('tradeItems');
    //订单商品项ids
    const goodsInfoIds = tradeItems.map((item) => item.get('skuId'));

    const { res: goodsResponse } = (await webapi.fetchOrderGoodsList({
      goodsInfoIds,
      customerId: accoutId
    })) as any;
    if (goodsResponse.code != Const.SUCCESS_CODE) return;
    // 商品列表、商品列表区间价当前信息
    let goodsInfos = fromJS(goodsResponse.context).get('goodsInfos');
    let goodsIntervalPrices = fromJS(goodsResponse.context).get(
      'goodsIntervalPrices'
    );

    //批量查询商品生效的营销活动
    const { res: goodsMarketingsRes } = (await webapi.fetchGoodsMarketings({
      goodsInfoIds: goodsInfos.map((sku) => sku.get('goodsInfoId')),
      customerId: accoutId
    })) as any;
    const skuMarketingsMap = fromJS(goodsMarketingsRes);

    //商品列表
    goodsInfos = goodsInfos.map((sku) => {
      const matchSku = tradeItems.find(
        (item) => item.get('skuId') == sku.get('goodsInfoId')
      );

      // 1.根据商品营销的情况，设置商品营销
      let skuMarketings = skuMarketingsMap.get(sku.get('goodsInfoId'));
      skuMarketings =
        skuMarketings && skuMarketings.size > 0 ? skuMarketings : undefined;
      const marketingId = matchSku.get('marketingIds')
        ? matchSku.get('marketingIds').get(0)
        : null;
      if (marketingId && skuMarketings) {
        if (
          skuMarketings
            .map((item) => item.get('marketingId'))
            .includes(marketingId)
        ) {
          // 1.1.如果商品已选营销没失效，设置商品营销
          sku = sku.set('marketingId', marketingId);
        } else if (skuMarketings.size > 0) {
          // 1.2.如果商品已选营销失效，且存在可选营销，则取第一个营销
          sku = sku.set('marketingId', skuMarketings.get(0).get('marketingId'));
        }
      }
      // 1.3.如果未选营销，且商品存在可选营销，则取第一个营销
      if (!marketingId && skuMarketings && skuMarketings.size > 0) {
        sku = sku.set('marketingId', skuMarketings.get(0).get('marketingId'));
      }

      sku = sku
        .set('specText', matchSku.get('specDetails'))
        .set('buyCount', matchSku.get('num'))
        .set('count', 0)
        .set('maxCount', 0)
        .set('initBuyCount', matchSku.get('num'))
        .set('stock', sku.get('delFlag') == 1 ? 0 : sku.get('stock'))
        .set('marketings', skuMarketings)
        .set('oldLevelPrice', matchSku.get('levelPrice'));
      return sku;
    });

    // 从请求中获取满减、满折总金额
    const discountsPriceDetails =
      tradePrice.get('discountsPriceDetails') || fromJS([]);
    const reduction = discountsPriceDetails.find(
      (item) => item.get('marketingType') == 0
    );
    const discount = discountsPriceDetails.find(
      (item) => item.get('marketingType') == 1
    );
    tradePrice = tradePrice
      .set('reduction', reduction)
      .set('discount', discount);

    //订单中商品的已购买数量
    const oldBuyCount = goodsInfos.map((sku) => {
      return {
        skuId: sku.get('goodsInfoId'),
        buyCount: sku.get('initBuyCount')
      };
    });

    //配送方式
    const deliverWay = detail.get('deliverWay');
    //支付信息
    const payInfo = detail.get('payInfo');
    //开票项目
    let projectOptions = fromJS([]);
    //用户增票资质
    let { res: invoice } = (await webapi.fentchInvoice(accoutId)) as any;
    if (invoice.code != Const.SUCCESS_CODE) return;
    invoice = invoice.context;

    if (orderInvoice.get('type') == 0 || orderInvoice.get('type') == 1) {
      const { res: projects } = await webapi.fetchInvoiceTitle();
      if (projects.code == Const.SUCCESS_CODE) {
        projectOptions = fromJS(projects.context);
      }
    }
    // 如果开票选择增票资质 && 没有增票资质
    if (orderInvoice.get('type') == 1 && !invoice.flag) {
      orderInvoice = orderInvoice.set('type', -1);
    }

    //买家备注
    const buyerRemark = detail.get('buyerRemark');
    //卖家备注
    const sellerRemark = detail.get('sellerRemark');
    //用户收货地址
    const { res } = (await webapi.addressList(accoutId)) as any;
    let {
      code: addressCode,
      context: addressContext,
      message: addressError
    } = res;

    if (addressCode != Const.SUCCESS_CODE) {
      message.error(addressError);
      return;
    }

    //订单附件
    const encloses = detail.get('encloses')
      ? detail.get('encloses').split(',')
      : [];
    const images = encloses.map((url, index) => {
      return { uid: index, name: index, size: 1, status: 'done', url: url };
    });

    this.transaction(() => {
      this.dispatch('trade:init', tid);
      this.dispatch('customer:select', accoutId);
      this.dispatch('customer:info:select', fromJS(newBuyer));
      this.dispatch('addrs:init:edit', {
        addressContext,
        consignee,
        orderInvoice
      });
      this.dispatch('goodsList:edit:init', {
        tradePrice,
        goodsInfos,
        goodsIntervalPrices
      });
      this.dispatch('goodsList:oldSkuIds', goodsInfoIds);
      this.dispatch('goodsList:oldBuyCount', oldBuyCount);
      this.dispatch('addrs:temp:address', consignee);
      this.dispatch('addrs:temp:invoice:address', orderInvoice);
      this.dispatch('extra:edit:init', {
        deliverWay,
        payType: payInfo.get('payTypeId'),
        buyerRemark: buyerRemark,
        sellerRemark: sellerRemark,
        invoiceType: orderInvoice.get('type'),
        invoiceProjectType: orderInvoice.getIn(['generalInvoice', 'flag']),
        invoiceResult: orderInvoice.get('projectId'),
        projectUpdateTime: orderInvoice.get('projectUpdateTime'),
        invoiceTitle: orderInvoice.getIn(['generalInvoice', 'title']),
        images,
        sperator: orderInvoice.get('sperator'),
        projectOptions,
        taxNo: orderInvoice.getIn(['generalInvoice', 'identification'])
      });
      this.dispatch('customer:invoice:init', invoice);
      this.dispatch('switchVisible', {
        field: 'customerTempAddressVisiable',
        result: customerTempAddressVisiable
      });
      this.dispatch('switchVisible', {
        field: 'customerInvoiceTempAddressVisiable',
        result: customerInvoiceTempAddressVisiable
      });
    });

    //重新计算
    this.calcTotalMoney();
    this.calcMarketings();
    this.freightFunc();

    //初始赠品信息
    startingMarketings.forEach(async (marketingId) => {
      const marketing = tradeMarketings.find(
        (item) => item.get('marketingId') == marketingId
      );
      //获取营销的赠品详情
      const {
        res: {
          context: { giftList }
        }
      } = (await webapi.fetchGiftList({
        marketingId: marketing.get('marketingId'),
        customerId: accoutId
      })) as any;
      this.dispatch('goodsList:setGiftList', {
        giftList: fromJS(giftList),
        marketingId: marketing.get('marketingId')
      });
      //选中营销的赠品
      marketing.get('giftIds').forEach((giftId) => {
        this.dispatch('goodsList:checkGift', {
          marketingId: marketing.get('marketingId'),
          giftLevelId: marketing.getIn(['giftLevel', 'giftLevelId']),
          giftId: giftId,
          checked: true
        });
      });
    });
  };

  onSelectCustomerName = async (customerAccount: string) => {
    //反查出accoutId
    const userInfo = this.state()
      .get('customers')
      .filter((v) => v.get('customerAccount') == customerAccount)
      .first();
    if (userInfo && userInfo.get('customerId')) {
      const accoutId = userInfo.get('customerId');
      const { res } = (await webapi.addressList(accoutId)) as any;
      let { code, context, message: errorInfo } = res;

      if (code != Const.SUCCESS_CODE) {
        message.error(errorInfo);
        return;
      }

      let { res: invoice } = await webapi.fentchInvoice(accoutId);
      if (invoice.code != Const.SUCCESS_CODE) return;
      invoice = invoice.context;

      this.transaction(() => {
        //清空旧客户相关信息

        this.dispatch('addrs:clear');
        this.dispatch('form:model:clear');
        this.dispatch('customer:clear');
        this.dispatch('goodsList:clear');
        this.dispatch('extra:clear');
        //新客户信息
        this.dispatch('customer:select', accoutId);
        this.dispatch('customer:info:select', userInfo);
        this.dispatch('addrs:init', context);
        this.dispatch('customer:invoice:init', invoice);
      });
    }
  };

  onSelectAddress = (addrId: string) => {
    if (addrId == 'tempId') {
      this.dispatch('switchVisible', {
        field: 'customerTempAddressVisiable',
        result: true
      });
    } else {
      this.dispatch('switchVisible', {
        field: 'customerTempAddressVisiable',
        result: false
      });
    }
    this.dispatch('addrs:select', addrId);
    this.freightFunc();
  };

  /**
   * 选择收发票地址
   * @param addrId
   */
  onSelectInvoiceAddress = (addrId: string) => {
    if (addrId == 'tempId') {
      this.dispatch('switchVisible', {
        field: 'customerInvoiceTempAddressVisiable',
        result: true
      });
    } else {
      this.dispatch('switchVisible', {
        field: 'customerInvoiceTempAddressVisiable',
        result: false
      });
    }
    this.dispatch('addrs:invoice:select', addrId);
  };

  addCustomer = async (customer) => {
    const { res } = await webapi.addCustomer(customer);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchCustomerFormVisible(false);
    } else {
      message.error(res.message);
    }
    return res.code;
  };

  /**
   * 编辑当前的地址
   */
  onEditAddress = (deliveryAddressId: string) => {
    this.transaction(() => {
      this.dispatch('addrs:edit', deliveryAddressId);
      this.dispatch('switchVisible', {
        field: 'switchAddressFormVisible',
        result: true
      });
      this.dispatch('addressType', 1);
    });
  };

  /**
   * 编辑当前发票收货地址
   * @param invoiceAddressId
   */
  onEditInvoiceAddress = (invoiceAddressId: string) => {
    this.transaction(() => {
      this.dispatch('addrs:invoice:edit', invoiceAddressId);
      this.dispatch('switchVisible', {
        field: 'switchAddressFormVisible',
        result: true
      });
      this.dispatch('addressType', 2);
    });
  };

  /**
   * 添加收货地址
   */
  addAddress = async (address) => {
    const customerId = this.state().get('selectedCustomerId');
    const { res } = await webapi.addAddress({
      ...address,
      customerId
    });

    if (res.code === Const.SUCCESS_CODE) {
      message.success('添加收货地址成功');
      const { res } = (await webapi.addressList(customerId)) as any;
      let { code, context, message: errorInfo } = res;

      if (code != Const.SUCCESS_CODE) {
        message.error(errorInfo);
        return;
      }

      this.transaction(() => {
        this.dispatch('switchAddressFormVisible', {
          field: 'switchAddressFormVisible',
          result: true
        });
        const addressType = this.state().get('addressType');
        this.dispatch('addrs:add', { addressList: context, addressType });
        this.dispatch('addressType', 0);
      });
    } else {
      message.error(res.message);
    }
  };

  updateAddress = async (address) => {
    const customerId = this.state().get('selectedCustomerId');
    const { res } = await webapi.updateAddress({
      ...address,
      customerId
    });
    if (res.code === Const.SUCCESS_CODE) {
      address = fromJS(res).get('context');
      message.success('更新收货地址成功');
      let editId = '';
      if (this.state().get('addressType') == 1) {
        editId = this.state().get('editDeliveryAddressId');
      } else if (this.state().get('addressType') == 2) {
        editId = this.state().get('editInvoiceAddressId');
      }

      let addrs = this.state().get('addrs');
      const index = addrs.findIndex(
        (add) => add.get('deliveryAddressId') == editId
      );
      addrs = addrs.setIn([index], address);

      let invoiceAddrs = this.state().get('invoiceAddrs');
      const invoiceIndex = invoiceAddrs.findIndex(
        (add) => add.get('deliveryAddressId') == editId
      );
      invoiceAddrs = invoiceAddrs.setIn([invoiceIndex], address);
      this.transaction(() => {
        this.dispatch('addrs:invoice:reset-edit-index');
        this.dispatch('addrs:reset-edit-index');
        this.dispatch('switchVisible', {
          field: 'switchAddressFormVisible',
          result: false
        });
        this.dispatch('addressType', 0);
        this.dispatch('addrs:edit:invoice:save', fromJS(invoiceAddrs.toJS()));
        this.dispatch('addrs:edit:save', fromJS(addrs.toJS()));
      });
    } else {
      message.error(res.message);
      this.dispatch('switchVisible', {
        field: 'switchAddressFormVisible',
        result: false
      });
      this.dispatch('addressType', 0);
    }
  };

  /**
   * 删除
   */
  onDeleteAddress = async (addressId: string) => {
    const { res } = await webapi.deleteAddress(addressId);
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('addrs:delete', addressId);
    } else {
      message.error(res.message);
    }
  };

  switchCustomerFormVisible = (result: boolean) => {
    this.dispatch('switchVisible', {
      field: 'switchCustomerFormVisible',
      result: result
    });
  };

  /**
   * 新增收货地址弹框开关
   * @param result
   */
  switchAddressFormVisible = (result: boolean) => {
    this.transaction(() => {
      this.dispatch('addrs:reset-edit-index');
      this.dispatch('addressType', 1);
      this.dispatch('switchVisible', {
        field: 'switchAddressFormVisible',
        result: result
      });
    });
  };

  /**
   * 新增发票收货地址弹框开关
   * @param result
   */
  switchInvoiceAddressFormVisible = (result: boolean) => {
    this.transaction(() => {
      this.dispatch('addrs:invoice:reset-edit-index');
      this.dispatch('addressType', 2);
      this.dispatch('switchVisible', {
        field: 'switchAddressFormVisible',
        result: result
      });
    });
  };

  /**
   * 设置满足条件的赠品活动
   * @param giftMarketings
   */
  setGiftMarketings = (giftMarketings) => {
    this.dispatch('goodsList:setGiftMarketings', giftMarketings);
  };

  /**
   * 获取满赠活动赠品详细信息
   * 如果已经缓存，则不做处理
   */
  getGiftList = async (params) => {
    const giftList = this.state().getIn([
      'marketingGiftList',
      params.marketingId
    ]);
    if (giftList) return;
    const { res } = (await webapi.fetchGiftList(params)) as any;
    this.dispatch('goodsList:setGiftList', {
      giftList: fromJS(res.context.giftList),
      marketingId: params.marketingId
    });
  };

  /**
   * 修改促销活动
   */
  onChangeMarketing = (goodsInfoId: string, marketingId: string) => {
    this.dispatch('goodsList:changeMarketing', { goodsInfoId, marketingId });
    //重新计算
    this.calcMarketings();
    this.freightFunc();
  };

  /**
   * 勾选赠品
   */
  onCheckGift = (params) => {
    this.dispatch('goodsList:checkGift', params);
    this.freightFunc();
  };

  /**
   * 根据商品Id删除选中的赠品
   */
  onDelGift = (goodsInfoId) => {
    this.dispatch('goodsList:delGift', goodsInfoId);
  };

  /**
   * 新增商品
   */
  onSelectGoodList = (goodsList, goodsIntervalPrices) => {
    //更新商品列表
    this.dispatch('goodsList:select', goodsList);
    //更新商品区间价
    this.dispatch('goodsList:setGoodsIntervalPrices', goodsIntervalPrices);
    //重新计算
    this.calcTotalMoney();
    this.calcMarketings();
    this.freightFunc();
  };

  /**
   * 根据商品Id删除商品信息
   * @param goodsInfoId
   */
  onDeleteSelectedGoodsList = (goodsInfoId: string) => {
    this.dispatch('goodsList:delete', goodsInfoId);
    this.calcTotalMoney();
    this.calcMarketings();
    this.freightFunc();
  };

  /**
   * 是否开启特价
   * @param enable
   */
  onEnableSpecVal = (enable: boolean) => {
    this.dispatch('goodsList:enableSpecVal', enable);
    //重新计算
    this.calcPayTotal();
  };

  /**
   * 改变特价值
   * @param price
   */
  onChangeSpecVal = (price: number) => {
    this.dispatch('goodsList:changeSpecVal', price);
    //重新计算
    this.calcPayTotal();
  };

  /**
   * 改变购买数量
   * @param goodsInfoId
   * @param num
   */
  onChangeBuyCount = (goodsInfoId: string, num: number) => {
    this.dispatch('goodsList:buyCount', { goodsInfoId, num });
    //重新计算
    this.calcTotalMoney();
    this.calcMarketings();
    this.freightFunc();
  };

  /**
   * 是否开启运费
   * @param checked
   */
  onEnableDeliverFee = (checked: boolean) => {
    this.dispatch('goodsList:enableDeliverFee', checked);
    if (!checked) {
      this.freightFunc();
    }
  };

  /**
   * 改变运费
   * @param price
   */
  onChangeDeliverFee = (price: number) => {
    this.dispatch('goodsList:changeDeliverFee', price);
    //重新计算
    this.calcPayTotal();
  };

  onExtraInfoChange = async ({ field, val }) => {
    //如果选择的是普通发票或者是增值税专用发票
    if (field == 'invoiceType') {
      this.dispatch('extra:invoice:init');
      if (val == 0 || val == 1) {
        const { res } = await webapi.fetchInvoiceTitle();
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch('extra:projectOptions', res.context);
        }
      }
    }
    this.dispatch('extra:change', { field, val });
  };

  /**
   * 代客下单
   * @param edit 是否是编辑
   * @param forceCommit 是否忽略营销变动，直接提交
   * @param validDeliver 是否验证配送费用变更
   */
  onCreateOrder = async (
    edit: boolean,
    forceCommit = false,
    validDeliver = true
  ) => {
    await this._calcFreight();
    if (
      edit &&
      validDeliver &&
      !this.state().getIn(['goodsList', 'isEnableDeliverFee'])
    ) {
      let newPrice = this.state().getIn(['goodsList', 'deliverFee']);
      newPrice = (newPrice || 0).toFixed(2);
      let oldPrice = this.state().getIn(['oldTradePrice', 'deliveryPrice']);
      oldPrice = (oldPrice || 0).toFixed(2);
      if (newPrice != oldPrice) {
        confirm({
          title: '配送费用变更',
          content: `由于配送地区、商品、运费模板或者运费计算模式发生了变化，配送费用已由￥${oldPrice}变更为￥${newPrice}，您可手动修改后再保存或者直接保存！`,
          okText: '直接保存',
          cancelText: '我要修改',
          onOk: () =>
            this.onCreateOrder(this.state().get('edit'), forceCommit, false)
        });
        return;
      }
    }

    //当前客人的id
    const custom = this.state().get('selectedCustomerId');
    //当前选中的地址id
    const selectedAddrId = this.state().get('selectedAddrId');
    const tempAddressMode = selectedAddrId == 'tempId';

    let consigneeAddress = '';
    let consigneeUpdateTime = moment().format(Const.TIME_FORMAT);
    if (!tempAddressMode) {
      //过滤出来当前的地址
      const address = this.state()
        .get('addrs')
        .filter((v) => v.get('deliveryAddressId') == selectedAddrId)
        .first();

      const provinceId = address.get('provinceId');
      const cityId = address.get('cityId');
      const areaId = address.get('areaId');

      //收货地址的修改时间
      consigneeUpdateTime = moment(address.get('updateTime')).format(
        Const.TIME_FORMAT
      );
      //收货地址
      consigneeAddress =
        FindArea.addressInfo(provinceId, cityId, areaId) +
        address.get('deliveryAddress');
    }

    //获取选中的货品
    const goodsList = this.state()
      .getIn(['goodsList', 'dataSource'])
      .map((v) => ({
        specDetails: v.get('specText'),
        skuId: v.get('goodsInfoId'),
        num: v.get('buyCount'),
        marketingIds: v.get('marketingId') ? [v.get('marketingId')] : []
      }))
      .toJS();
    const tradePrice = {};

    //是否开启特价
    const isEnableSpecVal = this.state().getIn([
      'goodsList',
      'isEnableSpecVal'
    ]);
    if (isEnableSpecVal) {
      //特价金额
      tradePrice['special'] = true;
      tradePrice['privilegePrice'] = this.state().getIn([
        'goodsList',
        'specVal'
      ]);
    }
    //是否开启运费
    const isEnableDeliverFee = this.state().getIn([
      'goodsList',
      'isEnableDeliverFee'
    ]);
    if (isEnableDeliverFee) {
      tradePrice['enableDeliveryPrice'] = true;
      tradePrice['deliveryPrice'] = this.state().getIn([
        'goodsList',
        'deliverFee'
      ]);
    }
    const invoice = {};

    //配送方式
    const deliverWay = this.state().getIn(['extra', 'deliverWay']);
    //目前只支持线下支付
    const payType = this.state().getIn(['extra', 'payType']);
    //发票信息 是否需要发票
    const invoiceType = this.state().getIn(['extra', 'invoiceType']);
    invoice['type'] = invoiceType;
    //纳税人识别码
    invoice['taxNo'] = this.state().getIn(['extra', 'taxNo']);

    if (invoiceType == 0 || invoiceType == 1) {
      //普通
      if (invoiceType == 0) {
        const generalInvoice = {};
        const invoiceProjectType = this.state().getIn([
          'extra',
          'invoiceProjectType'
        ]);
        generalInvoice['flag'] = invoiceProjectType;
        //单位
        if (invoiceProjectType == 1) {
          //发票抬头
          const invoiceTitle = this.state().getIn(['extra', 'invoiceTitle']);
          generalInvoice['title'] = invoiceTitle;
          generalInvoice['identification'] = this.state().getIn([
            'extra',
            'taxNo'
          ]);
        }
        invoice['generalInvoice'] = generalInvoice;
      } else if (invoiceType == 1) {
        //增值税专用发票
        const specialInvoice = {};
        //增票资质
        const invoiceFlag = this.state().get('invoiceFlag');
        const invoices = this.state().get('invoice');
        if (invoiceFlag && invoices) {
          specialInvoice['id'] = invoices.getIn([
            'customerInvoiceResponse',
            'customerInvoiceId'
          ]);
          invoice['specialInvoice'] = specialInvoice;
        }
      }

      //开票项目Id
      const invoiceResult = this.state().getIn(['extra', 'invoiceResult']);
      invoice['projectId'] = invoiceResult;
      //开票项目选项
      const projectOptions = fromJS(
        this.state().getIn(['extra', 'projectOptions'])
      );
      //开票项目Name
      const project = projectOptions
        .filter((project) => project.get('projectId') == invoiceResult)
        .first();
      invoice['projectName'] = project.get('projectName');
      invoice['projectUpdateTime'] = moment(
        project.get('projectUpdateTime')
      ).format(Const.TIME_FORMAT);

      //是否使用发票独立收货地址
      const sperator = this.state().getIn(['extra', 'sperator']);

      invoice['sperator'] = sperator;
      if (sperator) {
        //发票独立收货地址
        const selectedInvoiceAddrId = this.state().get('selectedInvoiceAddrId');
        //过滤出来当前的地址
        const invoiceAddress = this.state()
          .get('invoiceAddrs')
          .filter((v) => v.get('deliveryAddressId') == selectedInvoiceAddrId)
          .first();
        //考虑临时地址情况
        if (invoiceAddress != null) {
          //收货地址
          const iConsigneeAddress = invoiceAddress.get('deliveryAddress');
          invoice['address'] = iConsigneeAddress;
          invoice['updateTime'] = moment(
            invoiceAddress.get('updateTime')
          ).format(Const.TIME_FORMAT);
          invoice['addressId'] = selectedInvoiceAddrId;
        }
      } else {
        invoice['address'] = consigneeAddress;
        invoice['updateTime'] = consigneeUpdateTime;
        invoice['addressId'] = selectedAddrId;
      }
    }

    //附件
    const images = this.state()
      .getIn(['extra', 'images'])
      .filter((f) => f.get('status') == 'done')
      .map((f) => {
        return f.get('response') ? f.getIn(['response', 0]) : f.get('url');
      });

    //订单备注
    const buyerRemark = this.state().getIn(['extra', 'buyerRemark']);
    const sellerRemark = this.state().getIn(['extra', 'sellerRemark']);

    let params = {
      consigneeId: selectedAddrId,
      consigneeAddress,
      consigneeUpdateTime,
      tradeItems: goodsList,
      tradePrice,
      invoice,
      buyerRemark,
      sellerRemark,
      encloses: images ? images.toJS().join(',') : '',
      deliverWay,
      payType
    };
    params['consignee'] = this.state().get('consignee');

    if (tempAddressMode) {
      params['consigneeAddress'] = `${FindArea.addressInfo(
        params['consignee'].get('provinceId'),
        params['consignee'].get('cityId'),
        params['consignee'].get('areaId')
      )}${params['consignee'].get('address')}`;
    }

    params['invoiceConsignee'] = this.state().get('invoiceConsignee');

    //营销相关参数
    const giftMarketings = this.state().get('giftMarketings');
    const otherMarketings = this.state().get('otherMarketings');
    params['tradeMarketingList'] = giftMarketings
      .concat(otherMarketings)
      .map((item) => {
        let marketing = {} as any;
        marketing.marketingId = item.get('marketingId');
        if (item.get('marketingType') == 2) {
          // 如果是满赠，处理赠品
          let level = item
            .get('fullGiftLevelList')
            .filter(
              (level) =>
                level
                  .get('fullGiftDetailList')
                  .filter((gift) => gift.get('checked') == true).size > 0
            )
            .first();
          if (level) {
            marketing.marketingLevelId = level.get('giftLevelId');
            marketing.giftSkuIds = level
              .get('fullGiftDetailList')
              .filter((gift) => gift.get('checked'))
              .map((gift) => gift.get('productId'));
          }
        } else {
          // 否则直接记录levelId
          marketing.marketingLevelId = item.get('marketingLevelId');
        }
        marketing.skuIds = item
          .get('goodsInfos')
          .map((goodsInfo) => goodsInfo.get('goodsInfoId'));
        return marketing;
      })
      .filter((item) => item.marketingLevelId != undefined);

    params['forceCommit'] = forceCommit;

    if (!edit) {
      params['custom'] = custom;
    } else {
      params['tradeId'] = this.state().get('tradeId');
      params['newSkuIds'] = this.state().get('newSkuIds');
    }
    //清空临时地址
    this.emptyTempAddress(params);
    this.dispatch('order:submitting', true);
    const { res } = edit
      ? await webapi.remedyOrder(params)
      : await webapi.createOrder(params);

    this.dispatch('order:submitting', false);

    if (res.code == Const.SUCCESS_CODE) {
      message.success(edit ? '修改订单成功' : '恭喜，下单成功');
      history.push('/order-list');
    } else if (res.code == 'K-999999') {
      confirm({
        title: '优惠失效提醒',
        content: res.message,
        okText: '继续下单',
        cancelText: '重新下单',
        onOk: () => this.onCreateOrder(this.state().get('edit'), true),
        onCancel: () => history.push('/order-add')
      });
    } else {
      message.error(res.message);
    }
  };

  private emptyTempAddress(params: {
    consigneeId: any;
    consigneeAddress: string;
    consigneeUpdateTime: string;
    tradeItems: any;
    tradePrice: {};
    invoice: any;
    buyerRemark: any;
    sellerRemark: any;
    encloses: string;
    deliverWay: any;
    payType: any;
  }) {
    if (params.consigneeId == 'tempId') {
      params.consigneeId = null;
    }

    if (params.invoice.addressId == 'tempId') {
      params.invoice.addressId = null;
    }
  }

  /**
   * 清除待客下单所有信息
   */
  clearOrder = () => {
    this.transaction(() => {
      //清除客户信息
      this.dispatch('addrs:clear');
      this.dispatch('customer:clear');
      //清除商品清单
      this.dispatch('goodsList:clear');
      //清除附加信息
      this.dispatch('extra:clear');
    });
  };

  /**
   * 展示更多
   * @param showMore
   */
  showMore = (showType: number) => {
    this.dispatch('addrs:showMore', showType);
  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('extra:editImages', images);
  };

  /**
   * 发票收货地址展示更多
   * @param invoiceShowType
   */
  invoiceShowMore = (invoiceShowType: number) => {
    this.dispatch('addrs:invoice:showMore', invoiceShowType);
  };

  saveNewSkuIds = (newSkuIds: IList) => {
    this.dispatch('goodsList:newSkuIds', newSkuIds);
  };

  /**
   * 设置临时地址
   */
  settingTempAddress = (field: string, val: string) => {
    this.transaction(() => {
      if (field == 'tempAddress') {
        this.dispatch('addrs:temp:address', { provinceId: val[0] });
        this.dispatch('addrs:temp:address', { cityId: val[1] });
        this.dispatch('addrs:temp:address', { areaId: val[2] });
      } else {
        let object = {};
        object[`${field}`] = val;
        this.dispatch('addrs:temp:address', fromJS(object));
      }
    });
    this.freightFunc();
  };

  /**
   * 设置
   */
  settingInvoiceTempAddress = (field: string, val: string) => {
    this.transaction(() => {
      if (field == 'tempAddress') {
        this.dispatch('addrs:temp:invoice:address', { provinceId: val[0] });
        this.dispatch('addrs:temp:invoice:address', { cityId: val[1] });
        this.dispatch('addrs:temp:invoice:address', { areaId: val[2] });
      } else {
        let object = {};
        object[`${field}`] = val;
        this.dispatch('addrs:temp:invoice:address', fromJS(object));
      }
    });
  };
}
