import { Actor, Action, IMap } from 'plume2';
import { fromJS, List } from 'immutable';
import moment from 'moment';
import { Const } from 'qmkit';

export default class DeliveryAddressActor extends Actor {
  defaultState() {
    return {
      selectedAddrId: '',
      //选中的收发票地址
      selectedInvoiceAddrId: '',
      //编辑当前的收货地址的id，''没有任何编辑
      editDeliveryAddressId: '',
      //编辑当前的发票收货地址的id，''没有任何编辑
      editInvoiceAddressId: '',
      //用户收货地址
      addrs: [],
      //收发票地址
      invoiceAddrs: [],
      // 展示更多
      // 地址list < 10 --->  0
      // 地址list > 10 && 未点击展示更多--->  1
      // 地址list > 10 && 已点击展示更多 --->  2
      showType: 0,
      // 发票收货地址展示更多
      // 地址list < 10 --->  0
      // 地址list > 10 && 未点击展示更多--->  1
      // 地址list > 10 && 已点击展示更多 --->  2
      invoiceShowType: 0,
      //收货地址临时地址
      consignee: {},
      //发票临时地址
      invoiceConsignee: {}
    };
  }

  @Action('addrs:init')
  init(state: IMap, res) {
    // 初始化收货地址列表，如果超过10条设置展示更多
    if (fromJS(res).count() > 10) {
      state = state.set('showType', 1).set('invoiceShowType', 1);
    }
    //筛选用户默认地址
    const defaultRes = fromJS(res).filter(
      (add) => add.get('isDefaltAddress') === 1
    );
    if (defaultRes.count() > 0) {
      const addr = defaultRes.first();
      res = fromJS([addr]).concat(
        fromJS(res).filter(
          (add) =>
            add.get('deliveryAddressId') !== addr.get('deliveryAddressId')
        )
      );
      state = state
        .set('selectedAddrId', addr.get('deliveryAddressId'))
        .set('selectedInvoiceAddrId', addr.get('deliveryAddressId'));
    } else if (fromJS(res).count() > 0) {
      state = state
        .set(
          'selectedAddrId',
          fromJS(res)
            .first()
            .get('deliveryAddressId')
        )
        .set(
          'selectedInvoiceAddrId',
          fromJS(res)
            .first()
            .get('deliveryAddressId')
        );
    } else {
      state = state.set('selectedAddrId', '').set('selectedInvoiceAddrId', '');
    }
    return state.set('addrs', fromJS(res)).set('invoiceAddrs', fromJS(res));
  }

  /**
   * 编辑订单--地址初始化
   * @param state
   * @param res
   * @param consignee
   * @param orderInvoice
   * @returns {Map<string, V>}
   */
  @Action('addrs:init:edit')
  editInit(state: IMap, { addressContext, consignee, orderInvoice }) {
    // 初始化收货地址列表，如果超过10条设置展示更多
    if (fromJS(addressContext).count() > 10) {
      state = state.set('showType', 1).set('invoiceShowType', 1);
    }
    //收货地址id
    const consigneeId = consignee.get('id');
    //发票收货地址id
    const invoiceInfoId = orderInvoice.get('addressId');
    //收货地址
    const consignee2 = fromJS(addressContext).find(
      (r) => r.get('deliveryAddressId') == consigneeId
    );
    //发票收货地址
    const invoiceInfo2 = fromJS(addressContext).find(
      (r) => r.get('deliveryAddressId') == invoiceInfoId
    );

    let consignees = fromJS(addressContext).filter(
      (r) => r.get('deliveryAddressId') != consigneeId
    );
    let invoiceInfos = fromJS(addressContext).filter(
      (r) => r.get('deliveryAddressId') != invoiceInfoId
    );
    if (consignee2) {
      if (
        moment(consignee.get('updateTime')).format(Const.TIME_FORMAT) ==
        moment(consignee2.get('updateTime')).format(Const.TIME_FORMAT)
      ) {
        state = state.set('selectedAddrId', consigneeId);
      } else {
        state = state.set('selectedAddrId', '');
      }
      consignees = List.of(consignee2).concat(consignees);
    } else {
      state = state.set('selectedAddrId', 'tempId');
    }

    if (invoiceInfo2) {
      state = state.set('selectedInvoiceAddrId', invoiceInfoId);
      invoiceInfos = List.of(invoiceInfo2).concat(invoiceInfos);
    } else {
      state = state.set('selectedInvoiceAddrId', 'tempId');
    }
    return state.set('addrs', consignees).set('invoiceAddrs', invoiceInfos);
  }

  /**
   * 收货地址新增
   * @param state
   * @param res
   * @param addressType
   * @returns {Map<string, V>}
   */
  @Action('addrs:add')
  add(state: IMap, { addressList, addressType }) {
    // 初始化收货地址列表，如果超过10条设置展示更多
    if (fromJS(addressList).count() > 10) {
      state = state.set('showType', 1).set('invoiceShowType', 1);
    }
    if (fromJS(addressList).count() > 0) {
      if (fromJS(addressList).count() == 1) {
        return state
          .set('addrs', fromJS(addressList))
          .set('invoiceAddrs', fromJS(addressList))
          .set(
            'selectedAddrId',
            fromJS(addressList)
              .first()
              .get('deliveryAddressId')
          )
          .set(
            'selectedInvoiceAddrId',
            fromJS(addressList)
              .first()
              .get('deliveryAddressId')
          );
      }
      if (addressType == 1) {
        const first = fromJS(addressList).first();
        let olds = state.get('invoiceAddrs');
        const otherFirst = olds.first();
        olds = List.of(otherFirst)
          .concat(List.of(first))
          .concat(olds.shift());
        return state
          .set('selectedAddrId', first.get('deliveryAddressId'))
          .set('addrs', fromJS(addressList))
          .set('invoiceAddrs', olds);
      } else if (addressType == 2) {
        const first = fromJS(addressList).first();
        let olds = state.get('addrs');
        const otherFirst = olds.first();
        olds = List.of(otherFirst)
          .concat(List.of(first))
          .concat(olds.shift());
        return state
          .set('selectedInvoiceAddrId', first.get('deliveryAddressId'))
          .set('addrs', olds)
          .set('invoiceAddrs', fromJS(addressList));
      }
    } else {
      return state
        .set('selectedAddrId', '')
        .set('selectedInvoiceAddrId', '')
        .set('addrs', fromJS([]))
        .set('invoiceAddrs', fromJS([]));
    }
  }

  /**
   * 删除地址
   * @param state
   * @param addressId
   * @returns {any}
   */
  @Action('addrs:delete')
  delete(state: IMap, addressId) {
    const addrs = state
      .get('addrs')
      .filter((add) => add.get('deliveryAddressId') != addressId);
    const invoiceAddrs = state
      .get('invoiceAddrs')
      .filter((add) => add.get('deliveryAddressId') != addressId);

    // 初始化收货地址列表，如果超过10条设置展示更多
    if (addrs.count() > 10) {
      state = state.set('showType', 1);
    }
    if (invoiceAddrs.count() > 10) {
      state = state.set('invoiceShowType', 1);
    }
    if (addrs.count() == 1 || invoiceAddrs.count() == 1) {
      return state
        .set('addrs', addrs)
        .set('selectedAddrId', addrs.first().get('deliveryAddressId'))
        .set('invoiceAddrs', invoiceAddrs)
        .set(
          'selectedInvoiceAddrId',
          invoiceAddrs.first().get('deliveryAddressId')
        );
    }

    if (addrs.count() <= 0 || invoiceAddrs.count() <= 0) {
      return state
        .set('addrs', fromJS([]))
        .set('selectedAddrId', '')
        .set('invoiceAddrs', fromJS([]))
        .set('selectedInvoiceAddrId', '');
    }

    if (addressId == state.get('selectedAddrId')) {
      state = state.set(
        'selectedAddrId',
        addrs.first().get('deliveryAddressId')
      );
    }

    if (addressId == state.get('selectedInvoiceAddrId')) {
      state = state.set(
        'selectedInvoiceAddrId',
        invoiceAddrs.first().get('deliveryAddressId')
      );
    }
    return state.set('addrs', addrs).set('invoiceAddrs', invoiceAddrs);
  }

  @Action('addrs:select')
  select(state: IMap, addId) {
    let addrs = state.get('addrs');
    const addr = addrs.find((add) => add.get('deliveryAddressId') === addId);
    addrs = addrs.filter((add) => add.get('deliveryAddressId') !== addId);
    if (addId == 'tempId') {
      return state.set('selectedAddrId', addId);
    } else {
      return state
        .set('selectedAddrId', addId)
        .set('addrs', fromJS([addr]).concat(addrs));
    }
  }

  /**
   * 收发票地址选择
   * @param state
   * @param addId
   * @returns {Map<string, string|any[]|Buffer>}
   */
  @Action('addrs:invoice:select')
  invoiceSelect(state: IMap, addId) {
    let addrs = state.get('invoiceAddrs');
    const addr = addrs.find((add) => add.get('deliveryAddressId') === addId);
    addrs = addrs.filter((add) => add.get('deliveryAddressId') !== addId);
    if (addId == 'tempId') {
      return state.set('selectedInvoiceAddrId', addId);
    } else {
      return state
        .set('selectedInvoiceAddrId', addId)
        .set('invoiceAddrs', fromJS([addr]).concat(addrs));
    }
  }

  @Action('addrs:edit')
  clearEditAddr(state: IMap, deliveryAddressId: string) {
    return state.set('editDeliveryAddressId', deliveryAddressId);
  }

  @Action('addrs:reset-edit-index')
  name(state: IMap) {
    return state.set('editDeliveryAddressId', '');
  }

  /**
   * 编辑发票收货地址
   * @param state
   * @param editInvoiceAddressId
   * @returns {Map<string, string>}
   */
  @Action('addrs:invoice:edit')
  editInvoice(state: IMap, editInvoiceAddressId: string) {
    return state.set('editInvoiceAddressId', editInvoiceAddressId);
  }

  /**
   * 清空发票收货地址
   * @param state
   * @returns {Map<string, string>}
   */
  @Action('addrs:invoice:reset-edit-index')
  clearEditInvoiceAddr(state: IMap) {
    return state.set('editInvoiceAddressId', '');
  }

  /**
   * 发票收货地址编辑保存
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('addrs:edit:invoice:save')
  editSave(state: IMap, res) {
    return state.set('invoiceAddrs', fromJS(res));
  }

  /**
   * 收货地址编辑保存
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('addrs:edit:save')
  editInvoiceSave(state: IMap, res) {
    return state.set('addrs', fromJS(res));
  }

  /**
   * 清除收货地址
   * @param state
   * @returns {Map<string, string>}
   */
  @Action('addrs:clear')
  clear(state: IMap) {
    return state
      .set('addrs', fromJS([]))
      .set('consignee', fromJS({}))
      .set('invoiceAddrs', fromJS([]))
      .set('selectedAddrId', '')
      .set('selectedInvoiceAddrId', '')
      .set('showType', 0)
      .set('invoiceShowType', 0);
  }

  /**
   * 设置展示更多，类型
   * @param state
   * @param showType
   * @returns {Map<string, number>}
   */
  @Action('addrs:showMore')
  showMore(state: IMap, showType: number) {
    return state.set('showType', showType);
  }

  /**
   * 设置展示更多，发票收货地址类型
   * @param state
   * @param invoiceShowType
   * @returns {Map<string, number>}
   */
  @Action('addrs:invoice:showMore')
  invoiceShowMore(state: IMap, invoiceShowType: number) {
    return state.set('invoiceShowType', invoiceShowType);
  }

  /**
   *
   * @param sate
   * @param param1
   */
  @Action('addrs:temp:address')
  addressTemp(sate: IMap, value) {
    return sate.mergeDeepIn(['consignee'], value);
  }

  /**
   * 订单开票临时地址
   * @param sate
   * @param value
   */
  @Action('addrs:temp:invoice:address')
  invoiceAddressTemp(sate: IMap, value) {
    return sate.mergeDeepIn(['invoiceConsignee'], value);
  }
}
