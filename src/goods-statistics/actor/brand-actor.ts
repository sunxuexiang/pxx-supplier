/**
 * Created by feitingting on 2017/10/18.
 */
import { Actor, Action } from 'plume2';
import { IList } from 'typings/globalType';
import { List } from 'immutable';
export default class BrandActor extends Actor {
  defaultState() {
    return {
      brandReportList: '',
      //当前的数据总数
      brandTotal: 0,
      //当前的分页条数
      brandPageSize: 10,
      brandPageNum: 1,
      brandCurrent: 1, //当前显示的页，默认为1
      brandSortCol: 2, //默认按下单件数降序排序
      brandSortType: 1,
      brandName: '全部品牌', //品牌名称
      brandColumns: '',
      brandList: List(),
      brandId: ''
    };
  }

  @Action('goods:brandTable')
  brandTable(state, context) {
    //组装数据
    context.goodsReportList.map((report, i) => {
      //序号
      report.index =
        (state.get('brandCurrent') - 1) * state.get('brandPageSize') + i + 1;
      //下单金额
      report.orderAmt = '￥' + parseFloat(report.orderAmt).toFixed(2);
      //退单金额
      report.returnOrderAmt =
        '￥' + parseFloat(report.returnOrderAmt).toFixed(2);
      report.name = '无';
      context.goodsBrandViewList.map(view => {
        if (report.id == view.id) {
          //分类名称
          report.name = view.name;
        }
      });
    });
    return state.set('brandReportList', context.goodsReportList);
  }

  @Action('goods:brandTotal')
  tableTotal(state, total: number) {
    return state.set('brandTotal', total);
  }

  @Action('goods:brandCurrent')
  current(state, current) {
    return state.set('brandCurrent', current);
  }

  @Action('brand:sortCol')
  brandSortCol(state, sortCol) {
    return state.set('brandSortCol', sortCol);
  }

  @Action('brand:sortType')
  brandSortType(state, sortType) {
    return state.set('brandSortType', sortType);
  }

  @Action('brand:pageSize')
  pageSize(state, pageSize) {
    return state.set('brandPageSize', pageSize);
  }

  @Action('brand:brandName')
  brandName(state, name) {
    return state.set('brandName', name);
  }

  @Action('brand:columns')
  brandColumns(state, columns) {
    return state.set('brandColumns', columns);
  }

  /**
   * 品牌的全部分类
   * @param state
   * @param cateList
   */
  @Action('brand:list')
  init(state, brandList: IList) {
    return state.set('brandList', brandList);
  }

  /**
   * 品牌名称关键字
   * @param state
   * @param cateId
   */
  @Action('brand:brandId')
  brandId(state, brandId) {
    return state.set('brandId', brandId);
  }

  /**
   * 分类名称关键字
   * @param state
   * @param cateId
   */
  @Action('brand:emptyBrandId')
  emptyBrandId(state) {
    return state.set('brandId', '');
  }
}
