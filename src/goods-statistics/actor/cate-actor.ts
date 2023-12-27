/**
 * Created by feitingting on 2017/10/19.
 */
import { Actor, Action } from 'plume2';
import { IList } from 'typings/globalType';

export default class CateActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      cateTotal: 0,
      //当前的分页条数
      catePageSize: 10,
      catePageNum: 1,
      cateCurrent: 1,
      cateReportList: '',
      cateSortCol: 2, //默认按下单件数降序排序
      cateSortType: 1,
      cateName: '', //分类名称关键词
      cateColumns: '',
      cateList: [],
      cateId: '',
      defaultCate: '0'
    };
  }

  /**
   * 商品分类报表内容
   * @param state
   * @param context
   */
  @Action('goods:cateTable')
  skuTable(state, context) {
    //组装数据
    context.goodsReportList.map((report, i) => {
      //序号
      report.index =
        (state.get('cateCurrent') - 1) * state.get('catePageSize') + i + 1;
      report.name = '无';
      report.parentNames = '无';
      //下单金额
      report.orderAmt = '￥' + parseFloat(report.orderAmt).toFixed(2);
      //退单金额
      report.returnOrderAmt =
        '￥' + parseFloat(report.returnOrderAmt).toFixed(2);
      context.goodsCateViewList.map(view => {
        if (report.id == view.id) {
          //分类名称
          report.name = view.name;
          //父分类名称
          report.parentNames = view.parentNames;
        }
      });
    });
    return state.set('cateReportList', context.goodsReportList);
  }

  @Action('goods:cateTotal')
  tableTotal(state, total: number) {
    return state.set('cateTotal', total);
  }

  @Action('goods:cateCurrent')
  current(state, current) {
    return state.set('cateCurrent', current);
  }

  @Action('cate:sortCol')
  cateSortCol(state, sortCol) {
    return state.set('cateSortCol', sortCol);
  }

  @Action('cate:sortType')
  cateSortType(state, sortType) {
    return state.set('cateSortType', sortType);
  }

  @Action('cate:pageSize')
  pageSize(state, pageSize) {
    return state.set('catePageSize', pageSize);
  }

  /**
   * 分类报表展示列
   * @param state
   * @param columns
   */
  @Action('cate:columns')
  cateColumns(state, columns) {
    return state.set('cateColumns', columns);
  }

  /**
   * 商品的全部分类
   * @param state
   * @param cateList
   */
  @Action('cate:list')
  init(state, cateList: IList) {
    // 改变数据形态，变为层级结构(二级分类)
    const newDataList = cateList
      .filter(item => item.get('cateParentId') == 0)
      .map(data => {
        const children = cateList
          .filter(item => item.get('cateParentId') == data.get('storeCateId'))
          .map(childrenData => {
            // const lastChildren = cateList.filter(item => item.get('storeCateId') == childrenData.get('storeCateId'));
            // if (!lastChildren.isEmpty()) {
            //   childrenData = childrenData.set('children', lastChildren);
            // }
            return childrenData;
          });

        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('cateList', newDataList);
  }

  /**
   * 分类名称关键字
   * @param state
   * @param cateId
   */
  @Action('cate:cateId')
  cateId(state, cateId) {
    return state.set('cateId', cateId);
  }

  /**
   * 清空分类名称关键字
   * @param state
   * @param cateId
   */
  @Action('cate:emptyCateId')
  emptyCateId(state) {
    return state.set('cateId', '');
  }

  @Action('cate:cateName')
  cateName(state, name) {
    return state.set('cateName', name);
  }
}
