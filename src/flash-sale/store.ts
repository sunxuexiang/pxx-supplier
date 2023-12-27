import { Store } from 'plume2';
import { message } from 'antd';
import { fromJS } from 'immutable';
import { Const } from 'qmkit';
import * as webApi from './webapi';
import ListActor from './actor/list-actor';
import TableKeyActor from './actor/table-key-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new ListActor(), new TableKeyActor()];
  }

  /**
   * 初始化方法
   */
  init = async () => {
    this.getSoonList();
  };

  /**
   * 查询即将开场
   */
  getSoonList = async () => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    const { res: listRes } = await webApi.getSoonlist(param);
    if (listRes.code === Const.SUCCESS_CODE) {
      // 3.格式化返回结构
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch(
          'info:setListData',
          listRes.context.flashSaleActivityVOList
        );
      });
    } else {
      message.error(listRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 查询进行中
   */
  getSaleList = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = { pageNum, pageSize };
    const { res: pageRes } = await webApi.getSaleList(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      // 3.格式化返回结构
      let flashSaleActivityVOPage = pageRes.context.flashSaleActivityVOPage;
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', flashSaleActivityVOPage);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 查询已结束
   */
  getEndList = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    // 设置loading开始状态
    this.dispatch('info:setLoading', true);
    const param = this.state()
      .get('searchData')
      .toJS();
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    const { res: pageRes } = await webApi.getEndList(param);
    if (pageRes.code === Const.SUCCESS_CODE) {
      // 3.格式化返回结构
      let flashSaleActivityVOPage = pageRes.context.flashSaleActivityVOPage;
      this.transaction(() => {
        // 设置loading结束状态
        this.dispatch('info:setLoading', false);
        // 设置分页数据
        this.dispatch('info:setPageData', flashSaleActivityVOPage);
        // 设置当前页码
        this.dispatch('info:setCurrent', pageNum + 1);
      });
    } else {
      message.error(pageRes.message);
      this.dispatch('info:setLoading', false);
    }
  };

  /**
   * 设置搜索项信息并查询分页数据
   */
  onSearch = async () => {
    const activityKey = this.state().get('activityKey');
    if (activityKey == 0) {
      this.getSoonList();
    } else if (activityKey == 2) {
      this.getEndList();
    }
  };

  changeStartTime = (startTime, timeValue) => {
    this.dispatch('info:setSearchData', {
      searchData: fromJS(startTime),
      timeValue
    });
  };

  //tab-list 切换
  onActivityTabChange = (index: number) => {
    this.dispatch('change:activityKey', index);
    this.changeStartTime(fromJS({}), null);
    if (index == 0) {
      this.getSoonList();
    } else if (index == 1) {
      this.getSaleList();
    } else if (index == 2) {
      this.getEndList();
    }
  };
}
