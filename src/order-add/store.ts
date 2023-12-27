import { Store } from 'plume2';
import FormModalActor from './actor/form-modal-actor';
import CustomerActor from './actor/customer-actor';
import DeliveryAddressActor from './actor/delivery-address-actor';
import GoodsListActor from './actor/goods-list-actor';
import ExtraInfoActor from './actor/extra-info-actor';
import OrderActor from './actor/order-actor';
import { message, Modal } from 'antd';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
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
   * 计算优惠
   */
  // discountPref = async () => {
  //   return (await webapi.discountPrefinfo({
  //     goodsInfoIds,
  //     customerId: '',
  //     importGoodsInfosList: [{
  //       buyCount,
  //       goodsInfoId，
  //       stock
  //     }]
  //   })) as any;

  // }

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

    // 替换均摊价
    const tradeItems = this.state().getIn(['detail', 'tradeItems']);
    const goodsList = this.state()
      .get('goodsList')
      .get('dataSource')
      .map((g) => {
        g = g.set('num', g.get('buyCount')).set('skuId', g.get('goodsInfoId'));
        if (!tradeItems) return g;
        const goodsInfo = tradeItems.find(
          (o) => o.get('skuId') == g.get('goodsInfoId')
        );
        return g
          .set('num', goodsInfo.get('num'))
          .set('skuId', goodsInfo.get('skuId'))
          .set('splitPrice', goodsInfo.get('splitPrice'));
      });

    if (!goodsList || !goodsList.size) {
      this.dispatch('goodsList:changeDeliverFee', 0);
      this.calcPayTotal();
      return false;
    }

    const tradePrice = this.state().getIn(['detail', 'tradePrice']);
    let totalPrice;
    if (tradePrice) {
      // 修改订单的情况
      totalPrice = QMFloat.accSubtr(
        tradePrice.get('goodsPrice'),
        tradePrice.get('discountsPrice')
      );
    } else {
      // 代客下单的情况
      totalPrice = this.state().getIn(['goodsList', 'totalMoney']);
    }
    const tradeParams = {
      consignee,
      deliverWay: this.state()
        .get('extra')
        .get('deliverWay'),
      tradePrice: {
        totalPrice: totalPrice
      },
      oldTradeItems: goodsList.toJS(),
      oldGifts: this.state()
        .get('goodsList')
        .get('giftDataSource')
        .map((g) => g.set('skuId', g.get('goodsInfoId')))
        .toJS()
    };
    console.log(totalPrice);

    return webapi.fetchFreight(tradeParams).then((r) => {
      this.dispatch('goodsList:changeDeliverFee', r.res.context.deliveryPrice);
      // const goodsList = this.state().get('goodsList');
      // console.log(goodsList.get('totalMoney'));
      // this.dispatch('goodsList:setTotalMoney', Number(goodsList.get('totalMoney')) +  r.res.context.deliveryPrice);
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
    console.log(totalMoney);

    // this.dispatch('goodsList:setTotalMoney', totalMoney);
  };
  // 设置金额
  shezhijine = (totalMoney) => {
    // console.log(totalMoney);
    const goodsList = this.state().get('goodsList');
    console.log(goodsList.toJS(), '222222222222');

    this.dispatch('goodsList:setTotalMoney', totalMoney);
    this.dispatch('goodsList:setPayTotal', totalMoney);
    // this.dispatch('goodsList:setPayTotal', totalMoney);
  };

  /**
   * 计算并设置支付金额
   */
  calcPayTotal = () => {
    let payTotal;
    const goodsList = this.state().get('goodsList');
    //商品金额
    const totalMoney = this.state().getIn(['goodsList', 'totalMoney']);
    //满折、满减金额
    const discountPrice = this.state().get('discountPrice');
    const reductionPrice = this.state().get('reductionPrice');
    const couponPrice = this.state().get('couponPrice');
    const pointsPrice = this.state().get('pointsPrice');

    let deliverFee = goodsList.get('deliverFee').toFixed(2);
    //特价
    const isEnableSpecVal = goodsList.get('isEnableSpecVal');
    console.log(goodsList.toJS());

    const specVal = goodsList.get('specVal') || 0.0;
    if (isEnableSpecVal) {
      payTotal = QMFloat.accAdd(specVal, deliverFee).toFixed(2);
    } else {
      payTotal = QMFloat.accSubtr(
        QMFloat.accAdd(deliverFee, totalMoney),
        QMFloat.accAdd(discountPrice, reductionPrice)
      );
      payTotal = QMFloat.accSubtr(payTotal, couponPrice);
      payTotal = QMFloat.accSubtr(payTotal, pointsPrice);
      payTotal = QMFloat.addZero(payTotal);
    }
    console.log(payTotal);
    console.log(deliverFee);

    this.dispatch('goodsList:setPayTotal', payTotal);
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
            (Math.floor((tradeItem.get('splitPrice') / total) * 1000000) /
              1000000) *
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
    const { context } = newBuyer as any;
    if (!context || !fromJS(context).get('customerId')) {
      message.error('客户已被删除，不能修改订单！');
      history.push('/order-list');
      return;
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

    //商品列表
    goodsInfos = goodsInfos.map((sku) => {
      const matchSku = tradeItems.find(
        (item) => item.get('skuId') == sku.get('goodsInfoId')
      );

      sku = sku
        .set('specText', matchSku.get('specDetails'))
        .set('buyCount', matchSku.get('num'))
        .set('count', 0)
        .set('maxCount', 0)
        .set('initBuyCount', matchSku.get('num'))
        .set('stock', sku.get('delFlag') == 1 ? 0 : sku.get('stock'))
        .set('levelPrice', matchSku.get('levelPrice'));
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
      this.dispatch('customer:info:edit', fromJS(context));
      this.dispatch('addrs:init:edit', {
        addressContext,
        consignee,
        orderInvoice
      });
      this.dispatch('goodsList:edit:init', {
        tradePrice,
        goodsInfos,
        goodsIntervalPrices,
        gifts: detail.get('gifts').map((item) =>
          item
            .set('goodsInfoNo', item.get('skuNo'))
            .set('goodsInfoName', item.get('skuName'))
            .set('goodsSpecs', item.get('specDetails'))
            .set('gift', true)
        ),
        detail
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
    // this.calcTotalMoney();
    this.freightFunc();
  };

  onSelectCustomerName = async (customerAccount: string) => {
    //反查出accoutId
    const customers = this.state().get('customers');
    console.log(customers);
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
      //筛选用户默认地址cityCode;
      let cityId;
      const defaultRes = fromJS(context).filter(
        (add) => add.get('isDefaltAddress') === 1
      );
      if (defaultRes.count() > 0) {
        const addr = defaultRes.first();
        cityId = addr.get('cityId');
      } else if (fromJS(context).count() > 0) {
        cityId = fromJS(context)
          .first()
          .get('cityId');
      }
      const { res: wareHouseVOList } = (await webapi.mactchWareHouse({
        cityCode: cityId
      })) as any;
      wareHouseVOList.context.wareHouseVOList.pop();
      // const arrs = fromJS(wareHouseVOList.context.wareHouseVOList[0]);
      // console.log(arrs);
      // this.setSecletWareHouse(arrs)

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
        this.dispatch(
          'wareHouse:init',
          wareHouseVOList.context.wareHouseVOList
        );
        this.dispatch('selectWareHouse:clear');
        this.dispatch('addrs:init', context);
        this.dispatch('customer:invoice:init', invoice);
      });
    }
  };

  onSelectAddress = async (addrId: string) => {
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
    let addrs = this.state().get('addrs');
    const addr = addrs.find((add) => add.get('deliveryAddressId') === addrId);
    const { res: wareHouseVOList } = (await webapi.mactchWareHouse({
      cityCode: addr.get('cityId')
    })) as any;
    wareHouseVOList.context.wareHouseVOList.pop();
    this.dispatch('wareHouse:init', wareHouseVOList.context.wareHouseVOList);
    this.dispatch('addrs:select', addrId);
    this.dispatch('selectWareHouse:clear');
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
   * 新增商品
   */
  onSelectGoodList = (goodsList, goodsIntervalPrices) => {
    //更新商品列表
    this.dispatch('goodsList:select', goodsList);
    //更新商品区间价
    this.dispatch('goodsList:setGoodsIntervalPrices', goodsIntervalPrices);
    //重新计算
    this.calcTotalMoney();
    this.freightFunc();
  };
  couponCodegetId = (couponCodeId) => {
    this.dispatch('goodsList:couponCodeIds', couponCodeId);
  };

  /**
   * 根据商品Id删除商品信息
   * @param goodsInfoId
   */
  onDeleteSelectedGoodsList = (goodsInfoId: string) => {
    this.dispatch('goodsList:delete', goodsInfoId);
    this.calcTotalMoney();
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
    console.log(num);

    this.dispatch('goodsList:buyCount', { goodsInfoId, num });
    //重新计算
    this.calcTotalMoney();
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
    if ('deliverWay' == field) {
      await this._calcFreight();
      if (val == 1) {
        const { res: logistic } = await webapi.logisticscompany();
        this.dispatch(
          'logisticsCompanyList:init',
          logistic.context.logisticsCompanyVOList
        );
      } else {
        this.dispatch('logisticsCompanyList:init', []);
      }
    }
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
          onOk: () => this.onCreateOrder(edit, forceCommit, false)
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
    if (!deliverWay) {
      message.error('请选择配送方式');
      return;
    }

    const wareHouse = this.state().get('selectedWareHouse');
    if (!wareHouse) {
      confirm({
        title: '其选择仓库信息',
        okText: '确定',
        onOk: () => {}
      });
      return;
    }
    let logistId;
    if (deliverWay == 1) {
      logistId = this.state().getIn(['extra', 'selectLogistics']);
      if (!logistId || logistId.size == 0) {
        confirm({
          title: '其选择物流信息',
          okText: '确定',
          onOk: () => {}
        });
        return;
      }
    }
    const wareId = wareHouse.get('wareId');

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
          invoice['address'] = `${FindArea.addressInfo(
            invoiceAddress.get('provinceId'),
            invoiceAddress.get('cityId'),
            invoiceAddress.get('areaId')
          )}${iConsigneeAddress}`;
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
    const couponCodeIds = this.state().getIn(['goodsList', 'couponCodeIds']);
    // console.log(couponCodeIds);

    let params = {
      couponCodeId: couponCodeIds,
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
      payType,
      wareId,
      logisticsId: logistId
    };
    params['consignee'] = this.state().get('consignee');
    if (tempAddressMode) {
      params['consigneeAddress'] = `${FindArea.addressInfo(
        params['consignee'].get('provinceId'),
        params['consignee'].get('cityId'),
        params['consignee'].get('areaId')
      )}${params['consignee'].get('address')}`;
    }
    const invoiceConsignee = this.state().get('invoiceConsignee');
    params['invoiceConsignee'] = {};
    if (invoiceConsignee) {
      params['invoiceConsignee'].provinceId = invoiceConsignee.get(
        'provinceId'
      );
      params['invoiceConsignee'].cityId = invoiceConsignee.get('cityId');
      params['invoiceConsignee'].areaId = invoiceConsignee.get('areaId');
      params['invoiceConsignee'].name = invoiceConsignee.get('name');
      params['invoiceConsignee'].phone = invoiceConsignee.get('phone');
      params['invoiceConsignee'].address = `${FindArea.addressInfo(
        invoiceConsignee.get('provinceId'),
        invoiceConsignee.get('cityId'),
        invoiceConsignee.get('areaId')
      )}${invoiceConsignee.get('address')}`;
    }

    // params['tradeMarketingList'] = [];
    params['tradeMarketingList'] = this.state().get('tradeMarketingList');

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
  tradeMarketingListmap = (tradeMarketingList) => {
    // console.log(tradeMarketingList);

    this.dispatch('setetradeMarketingList', tradeMarketingList);
    // console.log(this.state().get('tradeMarketingList'));
  };
  /**
   * 清除待客下单所有信息
   */
  clearOrder = () => {
    this.transaction(() => {
      //清除客户信息
      // this.dispatch('addrs:clear');
      // this.dispatch('customer:clear');
      //清除商品清单
      // this.dispatch('goodsList:clear');
      //清除附加信息
      this.dispatch('extra:clear');
    });
  };
  // 批量删除、
  bachDelete = () => {
    const that = this;
    const goodsInfoIds = [];
    const arr = this.state()
      .get('goodsList')
      .get('dataSource')
      .toJS();
    arr.forEach((ele) => {
      goodsInfoIds.push(ele.goodsInfoId);
    });
    webapi
      .purchaseDele({
        customerId: that.state().get('selectedCustomerId'),
        goodsInfoIds: goodsInfoIds
      })
      .then((respoin) => {
        // console.log(respoin.res.code);
        if (respoin.res.code == 'K-000000') {
          this.clearOrdersy();
          history.go(0);
        }
      });
  };
  /**
   * 清除待客下单所有信息
   */
  clearOrdersy = () => {
    //  console.log(this.state()
    //  .get('goodsList')
    //  .get('dataSource').toJS());

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
  cleatr = () => {
    this.dispatch('goodsList:clear');
    this.state().setIn(['goodsList', 'dataSource'], fromJS([]));
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

  fetchCustomer = async (customerAccount) => {
    const { res } = (await webapi.fetchCustomer(customerAccount)) as any;
    if (res.length > 0) {
      this.transaction(() => {
        this.dispatch('customer:init', res);
      });
      // this.init(res)
    }
  };

  onDelGift = () => {};

  wareIdget = (value) => {
    this.dispatch('wareId:init', value);
  };

  clearAddress = async () => {
    const wareHouse = this.state().get('selectedWareHouse');
    return wareHouse;
  };

  setSecletWareHouse = async (value) => {
    // console.log('选择了仓库');

    let deliveryWays;
    if (value.get('pickUpFlag') == 1) {
      deliveryWays = [{ id: 3, name: '自提' }];
      this.dispatch('addressDetail:init', value.get('addressDetail'));
    } else {
      let selectedAddrIds = this.state().get('selectedAddrId');
      let selectedAddrId = sessionStorage.getItem('selectedAddrId');

      // if (selectedAddrId) {
      const { res: homeDeliveryFlag } = (await webapi.checkDeliveryHomeFlag({
        customerDeliveryAddressId: selectedAddrId
          ? selectedAddrId
          : selectedAddrIds,
        wareId: value.get('wareId')
      })) as any;
      if (homeDeliveryFlag.context?.flag == 0) {
        deliveryWays = [
          { id: 1, name: '托运部' },
          { id: 2, name: '快递到家（收费）' }
        ];
      } else {
        deliveryWays = [
          // { id: 1, name: '托运部' },
          { id: 2, name: '快递到家（收费）' },
          { id: 4, name: '免费店配（五件起）' }
        ];
      }
      sessionStorage.removeItem('selectedAddrId');
      // } else {
      //   deliveryWays = [
      //     { id: 1, name: '托运部' },
      //     { id: 2, name: '快递到家（收费）' }
      //   ];
      // }
    }
    this.transaction(() => {
      this.dispatch('deliveryWayList:init', deliveryWays);
      this.dispatch('wareHouse:select', value);
      this.dispatch('goodsList:clear');
      this.dispatch('extra:clear');
    });
  };
}
