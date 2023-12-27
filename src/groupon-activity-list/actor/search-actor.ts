import { Actor, Action } from 'plume2';
import { List, fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

export default class FundsActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 后端返回的页码
      pageNum: 0,
      dataList: List(),
      // 表单内容
      form: {
        // Tab类型 0: 即将开始, 1: 进行中, 2: 已结束，3：待审核，4：审核失败
        tabType: '1',
        //商品名称
        goodsName: '',
          //拼团分类ID
          grouponCateId: '',
        // 商家ID
        storeId: '',
        //开始时间
        startTime: null,
        //结束时间
        endTime: null,
        //是否精选
        sticky: '',
        storeName: '',
        startValue: '',
        endValue: '',
          sortColumn:'createTime',
          sortRole:'desc'
      },
      // 店铺名称模糊搜结果
      storeMap: {},
        //拼团分类集合
        grouponCateIdList: List()
    };
  }

    /**
     * 初始化拼团分类
     * @param state
     * @param res
     */
    @Action('set:group:cate:list')
    setGrouponCateIdList(state, res) {
        return state.update((state) => {
            return state.set('grouponCateIdList', fromJS(res));
        });
    }

  /**
   * 初始化拼团列表
   */
  @Action('group:list:init')
  init(state, res) {
    return state.update((state) => {
      return state
        .set('total', res.totalElements)
        .set('pageSize', res.size)
        .set('pageNum', res.number)
        .set('dataList', fromJS(res.content));
    });
  }

  /**
   * 设置列表form请求参数
   * @param state
   * @param param1
   */
  @Action('group:list:form:field')
  setFormField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }

  /**
   * 切换tab展示拼团列表
   * @param state
   * @param tabType
   */
  @Action('group:list:changeTab')
  changeTab(state: IMap, tabType) {
    return state.set(
      'form',
      fromJS({
        tabType: tabType,
        //商品名称
        goodsName: '',
        // 商家ID
        storeId: '',
        //开始时间
        startTime: null,
        //结束时间
        endTime: null,
        //是否精选
        sticky: '',
        storeName: '',
          sortColumn:'createTime',
          sortRole:'desc'
      })
    );
  }
}
