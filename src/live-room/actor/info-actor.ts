import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

interface IPageResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class InfoActor extends Actor {
  defaultState() {
    return {
      // 数据总条数
      total: 0,
      liveGoodsTotal: 0,
      // 每页显示条数
      pageSize: 10,
      liveGoodsPageSize: 10,
      // 当前页的直播列表数据
      dataList: [],
      // 当前页的直播商品库数据
      liveGoodsDataList: [],
      // 当前页的直播列表商品数据
      liveListGoodsDataList: [],
      // 当前页码
      current: 1,
      liveGoodsCurrent: 1,
      // 数据是否正在加载中
      loading: true,
      liveGoodLoading: true,
      liveListsGoodsLoading: true,
      liveGoodsSearchData: {},
      // 弹框是否展示
      visible: false,
      // 新增/编辑的表单信息
      formData: {},
      // 批量导出弹框 modal状态
      exportModalData: {},
      // 开通状态
      openStatus: '未开通',
      // 原因
      cause: '',
      // 当前直播列表tab页
      currentLiveListTab: '-1',
      // 当前直播商品库列表页
      currentLiveGoodsTab: '0',
      //当前主页面tab
      currentTab: '0',
      // 选择商品弹框是否展示
      goodsModalVisible: false,
      // 选中的商品
      chooseSkuIds: [],
      // 禁用的商品
      disabledSkuIds: [],
      // 选择的具体商品信息
      goodsRows: [],
      // 标记房间号
      roomId: '',
      // 搜索项信息
      searchData: {
        name: '',
        anchorName: null,
        startTime: null,
        endTime: null,
        storeName: null
      },
      // 商品列表信息
      goodsInfoList: []
    };
  }

  /**
   * 修改开通状态
   */
  @Action('change:openStatus')
  openStatus(state, status) {
    return state.set('openStatus', status);
  }

  /**
   * 修改原因
   */
  @Action('change:cause')
  cause(state, cause) {
    return state.set('cause', cause);
  }

  /**
   * 设置分页数据
   */
  @Action('info:setPageData')
  setPageData(state: IMap, res: IPageResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('total', totalElements)
        .set('pageSize', size)
        .set('dataList', fromJS(content));
    });
  }
  @Action('info:setLiveGoodsPageData')
  setLiveGoodsPageData(state: IMap, res: IPageResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('liveGoodsTotal', totalElements)
        .set('liveGoodsPageSize', size)
        .set('liveGoodsDataList', fromJS(content));
    });
  }

  /**
   * 设置当前页码
   */
  @Action('info:setCurrent')
  setCurrent(state: IMap, current) {
    return state.set('current', current);
  }
  @Action('info:setLiveGoodsCurrent')
  setLiveGoodsCurrent(state: IMap, current) {
    return state.set('liveGoodsCurrent', current);
  }

  /**
   * 设置loading状态
   */
  @Action('info:setLoading')
  setLoading(state: IMap, loading) {
    return state.set('loading', loading);
  }
  @Action('info:setLiveGoodsLoading')
  setLiveGoodsLoading(state: IMap, loading) {
    return state.set('liveGoodLoading', loading);
  }

  /**
   * 设置新增/编辑弹框是否展示
   */
  @Action('info:setVisible')
  setVisible(state: IMap, visible) {
    return state.set('visible', visible);
  }

  /**
   * 设置新增/编辑的表单信息
   */
  @Action('info:setFormData')
  setFormData(state: IMap, data: IMap) {
    return state.set('formData', data);
  }

  /**
   * 修改新增/编辑的表单字段值
   */
  @Action('info:editFormData')
  editFormData(state: IMap, { key, value }) {
    return state.setIn(['formData', key], value);
  }

  /**
   * 修改搜索项信息
   */
  @Action('info:setSearchData')
  setSearchData(state: IMap, searchData) {
    return state.set('searchData', searchData);
  }
  @Action('info:setLiveGoodsSearchData')
  setLiveGoodsSearchData(state: IMap, searchData) {
    return state.set('liveGoodsSearchData', searchData);
  }

  /**
   * 打开导出弹框 并设置 modal状态
   */
  @Action('info:exportModalShow')
  exportModalShow(state: IMap, exportModalData: IMap) {
    return state.set('exportModalData', exportModalData);
  }

  /**
   * 关闭导出弹框
   */
  @Action('info:exportModalHide')
  exportModalHide(state: IMap) {
    return state.setIn(['exportModalData', 'visible'], false);
  }

  /**
   * 切换直播列表tab
   */
  @Action('liveListTab:change')
  liveListTab(state: IMap, index) {
    return state.set('currentLiveListTab', index);
  }
  @Action('liveGoodsTab:change')
  liveGoodsTab(state: IMap, index) {
    return state.set('currentLiveGoodsTab', index);
  }
  @Action('liveTab:change')
  liveTab(state: IMap, index) {
    return state.set('currentTab', index);
  }

  /**
   * 设置直播间商品数据
   */
  @Action('info:setliveListGoodsDataList')
  setliveListGoodsDataList(state: IMap, res: IPageResponse) {
    return state.withMutations((state) => {
      state.set('liveListGoodsDataList', fromJS(res));
    });
  }

  /**
   * 键值设置
   * @param state
   * @param param1
   */
  @Action('info: field: value')
  fieldsValue(state, { field, value }) {
    state = state.set(field, fromJS(value));
    return state;
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['searchData', key], value);
  }

  @Action('info:setGoodsInfoList')
  setGoodsInfoList(state, value) {
    return state.set('goodsInfoList', value);
  }
}
