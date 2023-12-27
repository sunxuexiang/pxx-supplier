import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FreightGoodsActor extends Actor {
  defaultState() {
    return {
      // 是否是copy
      copyFlag: false,
      // 模板Id
      freightTempId: '',
      // 模板名称
      freightTempName: '',
      // 发货省
      provinceId: '',
      // 发货市
      cityId: '',
      // 仓库id
      wareId: null,
      // 发货区
      areaId: '',
      // 是否包邮(0: 不包邮(买家承担运费) 1: 包邮(卖家承担运费))
      freightFreeFlag: 0,
      // 计价方式(0: 按件数,1: 按重量,2: 按体积)
      valuationType: 0,
      // 是否指定条件包邮(0:不指定,1:指定)
      specifyTermFlag: 0,
      // 运送方式(2:快递配送)
      deliverWay: 2,
      // 是否默认(0:否,1:是)
      defaultFlag: 0,
      // 单品运费模板快递运送
      freightTemplateGoodsExpressSaveRequests: [
        {
          //id
          id: 'add_' + Math.random(),
          // 配送地id(逗号分隔)
          destinationArea: [],
          // 配送地名称(逗号分隔)
          destinationAreaName: ['未被划分的配送地区自动归于默认运费'],
          // 首件/重/体积
          freightStartNum: '',
          // 对应于首件/重/体积的起步价
          freightStartPrice: '',
          // 续件/重/体积
          freightPlusNum: '',
          // 对应于续件/重/体积的价格
          freightPlusPrice: '',
          // 是否默认
          defaultFlag: 1,
          // 是否删除 0: 否   1: 是
          delFlag: 0
        }
      ],
      // 单品运费模板指定包邮条件
      freightTemplateGoodsFreeSaveRequests: [
        {
          id: 'add_' + Math.random(),
          destinationArea: [],
          destinationAreaName: [],
          // 运送方式(1:快递配送)
          deliverWay: 1,
          // 计价方式(0:按件数,1:按重量,2:按体积)
          valuationType: 0,
          // 包邮条件类别(0: 件/ 重 / 体积计价方式, 1: 金额, 2: 计价方式 + 金额)
          conditionType: 0,
          // 包邮条件1(件/重/体积)
          conditionOne: '',
          // 包邮条件2(金额)
          conditionTwo: '',
          // 是否删除
          delFlag: 0
        }
      ],
      pageType: 0 //0: 运费模版,1:同城配送运费模版
    };
  }

  @Action('goods: freight: pageType')
  setPageType(state: IMap, res: number) {
    return state.set('pageType', res);
  }

  /**
   * 初始化数据
   * @param state
   * @param param1
   */
  @Action('goods: freight: init')
  fetchStoreFreight(
    state: IMap,
    {
      areaId,
      cityId,
      provinceId,
      freightTempName,
      defaultFlag,
      deliverWay,
      freightFreeFlag,
      freightTemplateGoodsExpresses,
      freightTemplateGoodsFrees,
      specifyTermFlag,
      valuationType,
      freightTempId,
      wareId
    }
  ) {
    const goodsExpress = fromJS(freightTemplateGoodsExpresses).map((exp) => {
      exp = exp
        .set('destinationArea', exp.get('destinationArea').split(','))
        .set('destinationAreaName', exp.get('destinationAreaName').split(','));
      return exp;
    });

    const goodsFree = fromJS(freightTemplateGoodsFrees).map((exp) => {
      exp = exp
        .set('destinationArea', exp.get('destinationArea').split(','))
        .set('destinationAreaName', exp.get('destinationAreaName').split(','));
      return exp;
    });

    return state
      .set('provinceId', provinceId)
      .set('cityId', cityId)
      .set('areaId', areaId)
      .set('wareId', wareId)
      .set('freightTempName', freightTempName)
      .set('defaultFlag', defaultFlag)
      .set('deliverWay', deliverWay)
      .set('freightFreeFlag', freightFreeFlag)
      .set('specifyTermFlag', specifyTermFlag)
      .set('valuationType', valuationType)
      .set('freightTempId', freightTempId)
      .set('freightTemplateGoodsExpressSaveRequests', goodsExpress)
      .set('freightTemplateGoodsFreeSaveRequests', goodsFree);
  }

  /**
   * 发货地区存储
   * @param state
   * @param param1
   */
  @Action('goods: freight: area')
  areaSave(state: IMap, { provinceId, cityId, areaId }) {
    return state
      .set('provinceId', provinceId)
      .set('cityId', cityId)
      .set('areaId', areaId);
  }

  /**
   * 修改指定字段值
   * @param state
   * @param param1
   */
  @Action('goods: freight: field: change')
  fieldChange(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  /**
   * 增加配送地区
   *
   * @param {IMap} state
   * @returns
   * @memberof FreightGoodsActor
   */
  @Action('goods: freight: shipping: add')
  shippingTypeAdd(state: IMap) {
    return state.set(
      'freightTemplateGoodsExpressSaveRequests',
      state.get('freightTemplateGoodsExpressSaveRequests').concat(
        fromJS([
          {
            //id
            id: 'add_' + Math.random(),
            // 配送地id(逗号分隔)
            destinationArea: fromJS([]),
            // 配送地名称(逗号分隔)
            destinationAreaName: fromJS([]),
            // 首件/重/体积
            freightStartNum: '',
            // 对应于首件/重/体积的起步价
            freightStartPrice: '',
            // 续件/重/体积
            freightPlusNum: '',
            // 对应于续件/重/体积的价格
            freightPlusPrice: '',
            // 是否默认
            defaultFlag: 0,
            // 是否删除 0: 否   1: 是
            delFlag: 0
          }
        ])
      )
    );
  }

  /**
   * 移除配送地区
   * @param state
   * @param id
   */
  @Action('goods: freight: shipping: sub')
  shippingTypeSub(state: IMap, id) {
    const index = state
      .get('freightTemplateGoodsExpressSaveRequests')
      .findIndex((r) => r.get('id') == id);
    const value = 1;
    return state.updateIn(
      ['freightTemplateGoodsExpressSaveRequests', index, 'delFlag'],
      () => value as any
    );
  }

  /**
   * 修改goodsExpressSaveRequests指定字段值
   * @param state
   * @param param1
   */
  @Action('goods: freight: express: field')
  goodsExpressSaveRequestsFieldValue(state: IMap, { id, field, value }) {
    const index = state
      .get('freightTemplateGoodsExpressSaveRequests')
      .findIndex((r) => r.get('id') == id);
    return state.updateIn(
      ['freightTemplateGoodsExpressSaveRequests', index, field],
      () => value
    );
  }

  /**
   * 修改goodsFreeSaveRequests指定字段值
   * @param state
   * @param param1
   */
  @Action('goods: freight: free: field')
  goodsFreeSaveRequestsFieldValue(state: IMap, { id, field, value }) {
    const index = state
      .get('freightTemplateGoodsFreeSaveRequests')
      .findIndex((r) => r.get('id') == id);
    return state.updateIn(
      ['freightTemplateGoodsFreeSaveRequests', index, field],
      () => value
    );
  }

  /**
   * 包邮模板新增
   * @param state
   */
  @Action('goods: freight: free: add')
  goodsFreeAdd(state: IMap) {
    return state.set(
      'freightTemplateGoodsFreeSaveRequests',
      state.get('freightTemplateGoodsFreeSaveRequests').concat(
        fromJS([
          {
            id: 'add_' + Math.random(),
            destinationArea: fromJS([]),
            destinationAreaName: fromJS([]),
            // 运送方式(1:快递配送)
            deliverWay: 1,
            // 计价方式(0:按件数,1:按重量,2:按体积)
            valuationType: 0,
            // 包邮条件类别(0: 件/ 重 / 体积计价方式, 1: 金额, 2: 计价方式 + 金额)
            conditionType: 0,
            // 包邮条件1(件/重/体积)
            conditionOne: '',
            // 包邮条件2(金额)
            conditionTwo: '',
            // 是否删除
            delFlag: 0
          }
        ])
      )
    );
  }

  /**
   * 包邮模板删除
   * @param state
   * @param id
   */
  @Action('goods: freight: free: sub')
  goodsFreeSub(state: IMap, id) {
    const index = state
      .get('freightTemplateGoodsFreeSaveRequests')
      .findIndex((r) => r.get('id') == id);
    const value = 1;
    return state.updateIn(
      ['freightTemplateGoodsFreeSaveRequests', index, 'delFlag'],
      () => value as any
    );
  }

  /**
   * 更改是否包邮
   *
   * @param {IMap} state
   * @param {any} flag
   * @returns
   * @memberof FreightGoodsActor
   */
  @Action('goods: freight: free')
  changeFreightFree(state: IMap, flag) {
    let request = state
      .get('freightTemplateGoodsExpressSaveRequests')
      .find((r) => r.get('defaultFlag') == 1);
    let requests = state
      .get('freightTemplateGoodsExpressSaveRequests')
      .filter((r) => r.get('defaultFlag') != 1)
      .map((m) => m.set('delFlag', 1));
    let freeRequests = state
      .get('freightTemplateGoodsFreeSaveRequests')
      .map((m) => m.set('delFlag', 1));
    if (flag) {
      request = request
        .set('freightStartNum', 1)
        .set('freightStartPrice', 0)
        .set('freightPlusNum', 1)
        .set('freightPlusPrice', 0);
    } else {
      request = request
        .set('freightStartNum', '')
        .set('freightStartPrice', '')
        .set('freightPlusNum', '')
        .set('freightPlusPrice', '');
    }
    return state
      .set(
        'freightTemplateGoodsExpressSaveRequests',
        fromJS([request]).concat(requests)
      )
      .set('freightTemplateGoodsFreeSaveRequests', freeRequests)
      .set('valuationType', 0);
  }

  /**
   * 更改是否按指定条件包邮
   *
   * @param {IMap} state
   * @param {any} flag
   * @returns
   * @memberof FreightGoodsActor
   */
  @Action('goods: freight: specify: change')
  changeSpecifyTermFlag(state: IMap, flag) {
    state = state.set('specifyTermFlag', flag);
    let requests = state
      .get('freightTemplateGoodsFreeSaveRequests')
      .map((m) => m.set('delFlag', 1));
    if (flag == 1) {
      return state.set(
        'freightTemplateGoodsFreeSaveRequests',
        fromJS([
          {
            id: 'add_' + Math.random(),
            destinationArea: fromJS([]),
            destinationAreaName: fromJS([]),
            // 运送方式(1:快递配送)
            deliverWay: 1,
            // 计价方式(0:按件数,1:按重量,2:按体积)
            valuationType: 0,
            // 包邮条件类别(0: 件/ 重 / 体积计价方式, 1: 金额, 2: 计价方式 + 金额)
            conditionType: 0,
            // 包邮条件1(件/重/体积)
            conditionOne: '',
            // 包邮条件2(金额)
            conditionTwo: '',
            // 是否删除
            delFlag: 0
          }
        ]).concat(requests)
      );
    } else {
      return state.set('freightTemplateGoodsFreeSaveRequests', requests);
    }
  }

  /**
   * 更改计价方式
   * @param state
   * @param value
   */
  @Action('goods: freight: valuation: change')
  changeValuationType(state: IMap, value) {
    let request = state
      .get('freightTemplateGoodsExpressSaveRequests')
      .find((f) => f.get('defaultFlag') == 1);
    request = request
      .set('freightStartNum', '')
      .set('freightStartPrice', '')
      .set('freightPlusNum', '')
      .set('freightPlusPrice', '');
    let requests = state
      .get('freightTemplateGoodsExpressSaveRequests')
      .filter((r) => r.get('defaultFlag') != 1)
      .map((m) => m.set('delFlag', 1));
    let freeRequests = state
      .get('freightTemplateGoodsFreeSaveRequests')
      .map((m) => m.set('delFlag', 1));
    return state
      .set('valuationType', value)
      .set(
        'freightTemplateGoodsExpressSaveRequests',
        fromJS([request]).concat(requests)
      )
      .set('freightTemplateGoodsFreeSaveRequests', freeRequests)
      .set('specifyTermFlag', 0);
  }

  /**
   * 存储是否是复制模板
   * @param state
   * @param isCopy
   */
  @Action('goods: freight: copy')
  isCopy(state: IMap, isCopy) {
    return state.set('copyFlag', isCopy);
  }
}
