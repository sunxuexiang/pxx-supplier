import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';

export default class GrouponActor extends Actor {
  defaultState() {
    return {
      // 基本信息，包含
      baseInfo: {},
      // 拼团活动商品列表
      goodsInfos: [],
      // 订单编号 --查询条件
      orderNo: null,
      // 订单分页数据
      orderPage: {
        dataList: [],
        //当前的数据总数
        total: 0,
        //当前的分页条数
        pageSize: 10,
        // 后端返回的页码
        pageNum: 0
      }
    };
  }

  /**
   * 详情初始化
   */
  @Action('groupon:detail:init')
  detailInit(state, params) {
    return state.merge(params);
  }

  /**
   * 订单列表分页
   */
  @Action('groupon:order:page')
  orderPage(state, res) {
    return state.update('orderPage', (page) => {
      return page
        .set('total', res.totalElements)
        .set('pageSize', res.size)
        .set('pageNum', res.number)
        .set('dataList', fromJS(res.content));
    });
  }

  /**
   * 设置订单编号
   */
  @Action('groupon:order:no')
  setOrderNo(state, orderNo) {
    return state.set('orderNo', orderNo);
  }
}
