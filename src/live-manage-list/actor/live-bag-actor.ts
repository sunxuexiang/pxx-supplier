import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

interface IPageResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class LiveBagActor extends Actor {
  defaultState() {
    return {
      // 数据总条数
      LiveBagTotal: 0,
      // 每页显示条数
      LiveBagPageSize: 10,
      // 当前页的数据列表
      // dataList: [],
      // 当前页码
      LiveBagCurrent: 1,
      // 数据是否正在加载中
      LiveBagLoading: true,
      // 搜索项信息
      LiveBagSearchData: {
        prizeName: '',
        bagStatus: ''
      },
      // // 设置勾选的id
      // checkedIds: [],
      // 弹框是否展示
      liveBagVisible: false,
      // 新增/编辑的表单信息
      liveBagFormData: {
        ticketWay: 0,
        joinType: 0,
        bagName: '',
        winningNumber: '',
        lotteryTime: '',
        selectedRowKeys: []
      },
      // // 批量导出弹框 modal状态
      // exportModalData: {},

      // //直播开启状态
      // openStatus: false,
      // // 卡片式tab页
      // currentCardTab: '0',
      // // 直播列表tab页
      // currentLiveListTab: '-1',
      // // 店铺列表
      // storeName: [],
      liveListBagDataList: []
      //   dataList: fromJS([{
      //     key: 1,
      //     name: '一级',
      //     age: 60,
      //     address: 'New York No. 1 Lake Park',
      //     children: [
      //       {
      //         key: 11,
      //         name: 'John Brown',
      //         age: 42,
      //         address: 'New York No. 2 Lake Park',
      //       },
      //       {
      //         key: 12,
      //         name: 'John Brown jr.',
      //         age: 30,
      //         address: 'New York No. 3 Lake Park',
      //       },
      //       {
      //         key: 13,
      //         name: 'Jim Green sr.',
      //         age: 72,
      //         address: 'London No. 1 Lake Park',
      //       },
      //     ],
      //   },
      //   {
      //     key: 2,
      //     name: 'Joe Black',
      //     age: 32,
      //     address: 'Sidney No. 1 Lake Park',
      //   },
      //   ]),
    };
  }

  // /**
  //  * 直播开启状态
  //  */
  // @Action('liveBag:openStatus')
  // getOpenStatus(state: IMap, status) {
  //   return state.set('openStatus', status);
  // }

  /**
   * 设置分页数据
   */
  @Action('liveBag:setPageData')
  setPageData(state: IMap, res: IPageResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('LiveBagTotal', totalElements)
        .set('LiveBagPageSize', size)
        .set('liveListBagDataList', fromJS(content));
    });
  }

  /**
   * 设置当前页码
   */
  @Action('liveBag:setCurrent')
  setCurrent(state: IMap, current) {
    return state.set('LiveBagCurrent', current);
  }

  /**
   * 设置loading状态
   */
  @Action('liveBag:setLoading')
  setLoading(state: IMap, loading) {
    return state.set('LiveBagLoading', loading);
  }

  /**
   * 修改搜索项信息
   */
  @Action('liveBag:setSearchData')
  setSearchData(state: IMap, { key, value }) {
    return state.setIn(['LiveBagSearchData', key], value);
  }

  // /**
  //  * 切换卡片式tab页
  //  */
  // @Action('change:setCurrentTab')
  // setCurrentTab(state: IMap, key) {
  //   return state.set('currentCardTab', key);
  // }

  // /**
  //  * 设置直播间商品数据
  //  */
  // @Action('info:setliveListGoodsDataList')
  // setliveListGoodsDataList(state: IMap, res: IPageResponse) {
  //   return state.withMutations((state) => {
  //     state.set('liveListGoodsDataList', fromJS(res));
  //   });
  // }

  // @Action('form: field')
  // formFiledChange(state, { key, value }) {
  //   return state.setIn(['LiveBagSearchData', key], value);
  // }
  // -----------------------------------------------------------------
  /**
   * 设置新增/编辑弹框是否展示
   */
  @Action('liveBag:setVisible')
  setVisible(state: IMap, visible) {
    return state.set('liveBagVisible', visible);
  }

  /**
   * 设置新增/编辑的表单信息
   */
  @Action('liveBag:setFormData')
  setFormData(state: IMap, data: IMap) {
    return state.set('liveBagFormData', data);
  }

  /**
   * 修改新增/编辑的表单字段值
   */
  @Action('liveBag:editFormData')
  editFormData(state: IMap, { key, value }) {
    return state.setIn(['liveBagFormData', key], value);
  }
}
