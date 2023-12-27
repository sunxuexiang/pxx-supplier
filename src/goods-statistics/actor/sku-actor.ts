/**
 * Created by feitingting on 2017/10/19.
 */
import { Actor, Action } from 'plume2';
export default class SkuActor extends Actor {
  defaultState() {
    return {
      skuReportList: '',
      //当前的数据总数
      skuTotal: 0,
      //当前的分页条数
      skuPageSize: 10,
      skuPageNum: 1,
      skuCurrent: 1, //当前显示的页，默认为1,
      skuSortCol: '2', //默认按下单件数降序排序
      skuSortType: '1',
      skuName: '', //商品搜索关键字
      skuColumns: ''
    };
  }

  /**
   * 商品报表显示内容
   * @param state
   * @param context
   */
  @Action('goods:skuTable')
  skuTable(state, context) {
    //组装数据
    context.goodsReportList.map((report, i) => {
      report.goodsInfoName = '无';
      //转化率加百分号
      report.orderConversion =
        parseFloat(report.orderConversion).toFixed(2) + '%';
      //下单金额
      report.orderAmt = '￥' + parseFloat(report.orderAmt).toFixed(2);
      //退单金额
      report.returnOrderAmt =
        '￥' + parseFloat(report.returnOrderAmt).toFixed(2);
      //序号
      report.index =
        (state.get('skuCurrent') - 1) * state.get('skuPageSize') + i + 1;

      context.goodsSkuViewList.map(view => {
        if (report.id == view.id) {
          //
          report.goodsInfoNo = view.goodsInfoNo;
          //商品名称
          report.goodsInfoName = view.goodsInfoName;
          report.erpGoodsInfoNo = view.erpGoodsInfoNo;
          //规格值名称
          report.detailName = view.detailName;
        }
      });
    });
    return state.set('skuReportList', context.goodsReportList);
  }

  /**
   * 总数
   * @param state
   * @param total
   */
  @Action('goods:skuTotal')
  tableTotal(state, total: number) {
    return state.set('skuTotal', total);
  }

  /**
   * 当期页
   * @param state
   * @param current
   */
  @Action('goods:skuCurrent')
  current(state, current) {
    return state.set('skuCurrent', current);
  }

  @Action('goods:sortCol')
  goodsSortCol(state, sortCol) {
    return state.set('skuSortCol', sortCol);
  }

  @Action('goods:sortType')
  goodsSortType(state, sortType) {
    return state.set('skuSortType', sortType);
  }

  @Action('goods:pageSize')
  pageSize(state, pageSize) {
    return state.set('skuPageSize', pageSize);
  }

  /**
   * 根据商品名称搜索
   * @param state
   * @param name
   */
  @Action('goods:skuName')
  skuName(state, name) {
    return state.set('skuName', name);
  }

  /**
   * 清空商品搜索关键字
   * @param state
   */
  @Action('goods:emptyName')
  emptyName(state) {
    return state.set('skuName', '');
  }

  /**
   * 商品报表列展示
   * @param state
   * @param columns
   */
  @Action('goods:columns')
  skuColumns(state, columns) {
    return state.set('skuColumns', columns);
  }
}
