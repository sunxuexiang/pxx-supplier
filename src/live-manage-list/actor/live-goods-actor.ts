import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

interface IPageResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class LiveGoodsActor extends Actor {
  defaultState() {
    return {
      // 数据总条数
      LiveGoodsTotal: 0,
      // 每页显示条数
      LiveGoodsPageSize: 10,
      // 当前页的数据列表
      LiveGoodsDataList: [],
      // 当前页码
      LiveGoodsCurrent: 1,
      // 数据是否正在加载中
      LiveGoodsLoading: true,
      // 搜索项信息
      LiveGoodsSearchData: {
        goodsStatus: ''
      },
      // 设置勾选的id
      LiveGoodsCheckedIds: [],
      // 弹框是否展示
      LiveGoodsVisible: false,
      // 新增/编辑的表单信息
      LiveGoodsFormData: {},
      // 批量导出弹框 modal状态
      LiveGoodsExportModalData: {},
      // 直播商品库当前tab
      currentLiveGoodsTab: '0',
      // 选择的具体商品信息
      LiveGoodsRows: fromJS([]),
      // 驳回模态框开关
      orderRejectModalVisible: false,
      goodsId: '',
      // 店铺列表
      liveGoodsStoreName: [],
      // 商品列表信息
      goodsInfoList: [],

      //选择商品弹框是否展示
      modalVisible: false,
      //选择商品设置勾选的id
      selectedSkuIds: [],
      //选择商品
      selectedRows: []
    };
  }

  /**
   * 设置分页数据
   */
  @Action('liveGoods:setPageData')
  setPageData(state: IMap, res: IPageResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('LiveGoodsTotal', totalElements)
        .set('LiveGoodsPageSize', size)
        .set('LiveGoodsDataList', fromJS(content));
    });
  }

  /**
   * 设置当前页码
   */
  @Action('liveGoods:setCurrent')
  setCurrent(state: IMap, current) {
    return state.set('LiveGoodsCurrent', current);
  }

  /**
   * 设置loading状态
   */
  @Action('liveGoods:setLoading')
  setLoading(state: IMap, loading) {
    return state.set('LiveGoodsLoading', loading);
  }

  /**
   * 设置新增/编辑弹框是否展示
   */
  @Action('liveGoods:setVisible')
  setVisible(state: IMap, visible) {
    return state.set('LiveGoodsVisible', visible);
  }

  /**
   * 设置新增/编辑的表单信息
   */
  @Action('liveGoods:setFormData')
  setFormData(state: IMap, data: IMap) {
    return state.set('LiveGoodsFormData', data);
  }

  /**
   * 修改新增/编辑的表单字段值
   */
  @Action('liveGoods:editFormData')
  editFormData(state: IMap, { key, value }) {
    return state.setIn(['LiveGoodsFormData', key], value);
  }

  /**
   * 修改搜索项信息
   */
  @Action('liveGoods:setSearchData')
  setSearchData(state: IMap, { key, value }) {
    return state.setIn(['LiveGoodsSearchData', key], value);
  }

  /**
   * 设置勾选的id
   */
  @Action('liveGoods:setCheckedData')
  setCheckedData(state: IMap, ids) {
    return state.set('LiveGoodsCheckedIds', ids);
  }

  @Action('liveGoods:setLiveGoodsRows')
  setLiveGoodsRows(state: IMap, row) {
    return state.set('LiveGoodsRows', row);
  }

  /**
   * 打开导出弹框 并设置 modal状态
   */
  @Action('liveGoods:exportModalShow')
  exportModalShow(state: IMap, exportModalData: IMap) {
    return state.set('LiveGoodsExportModalData', exportModalData);
  }

  /**
   * 关闭导出弹框
   */
  @Action('liveGoods:exportModalHide')
  exportModalHide(state: IMap) {
    return state.setIn(['LiveGoodsExportModalData', 'LiveGoodsVisible'], false);
  }

  /**
   * 切换直播商品库tab页
   */
  @Action('change:setLiveGoodsTab')
  setLiveGoodsTab(state: IMap, key) {
    return state.set('currentLiveGoodsTab', key);
  }

  /**
   * 显示驳回弹框
   * @param state
   */
  @Action('order:list:reject:show')
  showRejectModal(state: IMap) {
    return state.set('orderRejectModalVisible', true);
  }

  /**
   *关闭驳回弹框
   * @param state
   */
  @Action('order:list:reject:hide')
  hideRejectModal(state: IMap) {
    return state.set('orderRejectModalVisible', false);
  }

  /**
   * 设置驳回的商品id
   */
  @Action('modal:goodsId')
  setGoodsId(state, id) {
    return state.set('goodsId', id);
  }

  /**
   * 设置店铺列表
   */
  @Action('liveGoods:setStoreName')
  setStoreName(state: IMap, storeName) {
    return state.set('liveGoodsStoreName', storeName);
  }

  @Action('liveGoods:setGoodsInfoList')
  setGoodsInfoList(state, value) {
    return state.set('goodsInfoList', value);
  }
  //修改actor的值
  @Action('goods:info')
  setGoodsInfo(state, { key, value }) {
    return state.set(key, value);
  }
}
