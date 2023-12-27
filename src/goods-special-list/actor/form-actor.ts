import { Actor, Action, IMap } from 'plume2';
import { Map, fromJS } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        // 模糊条件-商品名称
        likeGoodsName: '',
        // 模糊条件-SKU编码
        likeGoodsInfoNo: '',
        // 店铺名称
        storeName: '',
        //店铺id
        storeId: null,
        // 商品分类
        cateId: null,
        // 品牌编号
        brandId: null,
        // 上下架状态
        addedFlag: null,
        // 门店价范围参数1
        salePriceFirst: null,
        // 门店价范围参数2
        salePriceLast: null,
        // 分销佣金范围参数1
        distributionCommissionFirst: null,
        // 分销佣金范围参数2
        distributionCommissionLast: null,
        commissionRateFirst: null,
        // 分销佣金范围参数2
        commissionRateLast: null,
        // 分销销量范围参数1
        // distributionSalesCountFirst: null,
        // 分销销量范围参数2
        // distributionSalesCountLast: null,
        // 分销商品审核状态 0:普通商品 1:待审核 2:已审核通过 3:审核不通过 4:禁止分销
        distributionGoodsAudit: '2',
        // 商品搜索项类型 0: 商品名称 1: SKU编码
        optGoodsType: '0',
        // 店铺搜索项类型 0: 店铺名称 1: 店铺编号
        optStoreType: '0',
        //排序字段
        sortColumn: 'createTime',
        //排序规则 desc asc
        sortRole: 'desc'
      },
      //列表页字段排序规则
      sortedInfo: Map({ order: 'descend', columnKey: 'createTime' }),
      // 店铺名称模糊搜结果
      storeMap: {}
    };
  }

  /**
   * 分销商品查询条件
   * @param {IMap} state
   * @param {any} key
   * @param {any} value
   * @returns {Map<string, any>}
   */
  @Action('form:field')
  formFieldChange(state: IMap, { key, value }) {
    return state.setIn(['form', key], value);
  }

  /**
   * 清空查询条件
   * @param {IMap} state
   * @returns {Map<string, any>}
   */
  @Action('form: field: clear')
  formFieldClear(state: IMap) {
    return (
      state
        .setIn(['form', 'likeGoodsName'], '')
        .setIn(['form', 'likeGoodsInfoNo'], '')
        .setIn(['form', 'storeName'], '')
        .setIn(['form', 'storeId'], null)
        .setIn(['form', 'cateId'], null)
        .setIn(['form', 'brandId'], null)
        .setIn(['form', 'addedFlag'], null)
        .setIn(['form', 'salePriceFirst'], null)
        .setIn(['form', 'salePriceLast'], null)
        .setIn(['form', 'distributionCommissionFirst'], null)
        .setIn(['form', 'distributionCommissionLast'], null)
        .setIn(['form', 'commissionRateFirst'], null)
        .setIn(['form', 'commissionRateLast'], null)
        // .setIn(['form', 'distributionSalesCountFirst'], null)
        // .setIn(['form', 'distributionSalesCountLast'], '')
        .setIn(['form', 'optGoodsType'], '0')
        .setIn(['form', 'optStoreType'], '0')
        .setIn(['form', 'sortColumn'], 'createTime')
        .setIn(['form', 'sortRole'], 'desc')
    );
  }

  /**
   * 设置排序规则
   * @param {IMap} state
   * @param data
   * @returns {Map<string, V>}
   */
  @Action('form: sort')
  setSortedInfo(state: IMap, data) {
    let sortedInfo = data;
    if (!sortedInfo.columnKey) {
      sortedInfo = { columnKey: 'createTime', order: 'descend' };
    }
    return state.set('sortedInfo', fromJS(sortedInfo));
  }

  /**
   * 店铺名称模糊搜结果
   * @param {IMap} state
   * @param storeMap
   * @returns {Map<string, any>}
   */
  @Action('form: store: info')
  storeMap(state: IMap, storeMap) {
    return state.set('storeMap', fromJS(storeMap));
  }
}
