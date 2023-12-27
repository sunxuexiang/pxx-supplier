import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

interface IPageResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class LiveCompanyActor extends Actor {
  defaultState() {
    return {
      // 数据总条数
      liveCompanyTotal: 0,
      // 每页显示条数
      liveCompanyPageSize: 10,
      // 当前页的数据列表
      liveCompanyDataList: [],
      // 当前页码
      liveCompanyCurrent: 1,
      // 数据是否正在加载中
      liveCompanyLoading: true,
      // 搜索项信息
      liveCompanySearchData: {},
      // 设置勾选的id
      liveCompanyCheckedIds: [],
      // 弹框是否展示
      liveCompanyVisible: false,
      // 新增/编辑的表单信息
      liveCompanyFormData: {},
      // 批量导出弹框 modal状态
      liveCompanyExportModalData: {},
      // 直播商家tab
      currentLiveCompanyTab: '1',
      modalType: '3',
      storeId: '',
      //活动弹框
      isActivityModal: false,
      selectedRowKeys: [],
      selectedRows: [],
      //优惠 券弹框
      isCouponsModal: false,
      activityId: null,
      couponsType: 'dis'
    };
  }

  /**
   * 设置分页数据
   */
  @Action('liveCompany:setPageData')
  setPageData(state: IMap, res: IPageResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('liveCompanyTotal', totalElements)
        .set('liveCompanyPageSize', size)
        .set('liveCompanyDataList', fromJS(content));
    });
  }

  /**
   * 设置当前页码
   */
  @Action('liveCompany:setCurrent')
  setCurrent(state: IMap, current) {
    return state.set('liveCompanyCurrent', current);
  }

  /**
   * 设置loading状态
   */
  @Action('liveCompany:setLoading')
  setLoading(state: IMap, loading) {
    return state.set('liveCompanyLoading', loading);
  }

  /**
   * 设置新增/编辑弹框是否展示
   */
  @Action('liveCompany:setVisible')
  setVisible(state: IMap, visible) {
    return state.set('liveCompanyVisible', visible);
  }

  /**
   * 设置新增/编辑的表单信息
   */
  @Action('liveCompany:setFormData')
  setFormData(state: IMap, data: IMap) {
    return state.set('liveCompanyFormData', data);
  }

  /**
   * 修改新增/编辑的表单字段值
   */
  @Action('liveCompany:editFormData')
  editFormData(state: IMap, { key, value }) {
    return state.setIn(['liveCompanyFormData', key], value);
  }

  /**
   * 修改搜索项信息
   */
  @Action('liveCompany:setSearchData')
  setSearchData(state: IMap, searchData) {
    return state.set('liveCompanySearchData', searchData);
  }

  /**
   * 设置勾选的id
   */
  @Action('liveCompany:setCheckedData')
  setCheckedData(state: IMap, ids) {
    return state.set('liveCompanyCheckedIds', ids);
  }

  /**
   * 打开导出弹框 并设置 modal状态
   */
  @Action('liveCompany:exportModalShow')
  exportModalShow(state: IMap, exportModalData: IMap) {
    return state.set('liveCompanyExportModalData', exportModalData);
  }

  /**
   * 关闭导出弹框
   */
  @Action('liveCompany:exportModalHide')
  exportModalHide(state: IMap) {
    return state.setIn(['liveCompanyExportModalData', 'visible'], false);
  }

  /**
   * 切换直播商家tab页
   */
  @Action('change:setLiveCompanyTab')
  setLiveCompanyTab(state: IMap, key) {
    return state.set('currentLiveCompanyTab', key);
  }

  /**
   * 驳回禁用模态框
   */
  @Action('modal:type')
  modalType(state, type) {
    return state.set('modalType', type);
  }

  /**
   * 设置选中模态框的商家id
   */
  @Action('modal:storeId')
  storeId(state, id) {
    return state.set('storeId', id);
  }

  /**
   * 设置选中模态框的商家id
   */
  @Action('company:info')
  companyInfo(state, { key, value }) {
    return state.set(key, value);
  }
}
