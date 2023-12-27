import { Actor, IMap, Action } from 'plume2';
import { Map, fromJS } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      customerSearchSelect: fromJS({
        '0': '客户账号',
        '1': '客户名称',
        checked: '0'
      }),
      distributionSearchSelect: fromJS({
        '0': '分销员账号',
        '1': '分销员名称',
        checked: '0'
      }),

      goodsInfoSearchSelect: fromJS({
        '0': '商品编码',
        '1': '商品名称',
        checked: '0'
      }),
      filterDistributionCustomerData: fromJS([]),
      filterCustomerData: fromJS([]),
      filterGoodsInfoData: fromJS([]),
      form: fromJS({
        //是否入账
        commissionState: '1',
        //分销员Id
        distributorId: '',
        //会员Id
        customerId: '',
        //货品Id
        goodsInfoId: '',
        //订单编号
        tradeId: '',
        //删除标志
        deleteFlag: '0'
      })
    };
  }

  @Action('form:field')
  formFieldChange(state, { field, value }) {
    return state.setIn(['form', field], value);
  }

  @Action('form:clear')
  formFieldClear(state: IMap) {
    return state.set('form', Map());
  }

  /**
   * 检索类型，名称or账号，分销员or货品or店铺or会员
   * @param state
   * @param param1
   */
  @Action('distribution:record:searchKind')
  searchKind(state: IMap, { kind, value }) {
    if (kind == 'customer') {
      //会员信息
      return state.setIn(['customerSearchSelect', 'checked'], value);
    } else if (kind == 'distributor') {
      //分销员信息
      return state.setIn(['distributionSearchSelect', 'checked'], value);
    } else {
      //货品信息
      return state.setIn(['goodsInfoSearchSelect', 'checked'], value);
    }
  }

  @Action('distribution:record:filterDistributionCustomer')
  filterDistributionCustomer(state, res) {
    const filterDistributionCustomerData = res.map((v) => {
      return {
        key: v.distributionId,
        value: v.customerAccount + ' ' + v.customerName
      };
    });
    return state.set(
      'filterDistributionCustomerData',
      fromJS(filterDistributionCustomerData)
    );
  }

  @Action('distribution:record:filterCustomer')
  filterCustomerData(state, res) {
    const filterCustomerData = res.map((v) => {
      return {
        key: v.customerId,
        value: v.customerVO.customerAccount + ' ' + v.customerName
      };
    });
    return state.set('filterCustomerData', fromJS(filterCustomerData));
  }

  @Action('distribution:record:filterGoodsInfo')
  filterGoodsInfoData(state, res) {
    const filterGoodsInfoData = res.map((v) => {
      return {
        key: v.goodsInfoId,
        value: v.goodsInfoNo + ' ' + v.goodsInfoName
      };
    });
    return state.set('filterGoodsInfoData', fromJS(filterGoodsInfoData));
  }
}
