/**
 * Created by feitingting on 2017/10/16.
 */

import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import moment from 'moment';

import { Const } from 'qmkit';

import FlowStatisticsActor from './actor/flow-statistics-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FlowStatisticsActor()];
  }

  /**
   * 初始化方法
   *
   * @returns {Promise<void>}
   */
  init = async () => {
    const nowDay = moment(new Date())
      .format(Const.DAY_FORMAT)
      .toString();
    this.setDateRange(nowDay, nowDay, 0);
  };

  /**
   * 设置页面的时间范围
   *
   * @param startTime
   * @param endTime
   */
  setDateRange = (startTime, endTime, dateCycle) => {
    this.transaction(() => {
      this.dispatch('flow:setDateRange', {
        startTime: startTime,
        endTime: endTime,
        dateCycle: dateCycle
      });
      const weekly = this.state().get('weekly');
      const pageSize = this.state().get('pageSize');
      if (weekly) {
        if (this.getWeeklyDisplay(startTime, endTime)) {
          this.getFlowData(true);
        } else {
          this.setCurrentChartWeekly(false);
          this.getFlowData(false);
        }
      } else {
        this.getFlowData(false);
      }
      const sortedInfo = this.state()
        .get('sortedInfo')
        .toJS();
      this.getPageData(1, pageSize, sortedInfo.columnKey, sortedInfo.order);
    });
  };

  /**
   * 获取分页table数据
   *
   * @param pageNum
   * @param pageSize
   * @param sortName
   * @param sortType
   * @returns {Promise<void>}
   */
  getPageData = async (pageNum, pageSize, sortName, sortType) => {
    const { dateCycle } = this.state()
      .get('dateRange')
      .toJS();
    const { res } = await webapi.getPageData(
      dateCycle,
      pageNum,
      pageSize,
      sortName,
      sortType
    );
    if (res && res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('flow:getPageData', res.context);
        this.dispatch('flow:setPageSize', pageSize);
        this.dispatch('flow:setSortedInfo', {
          columnKey: sortName,
          order: sortType
        });
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 获取流量概况和折线图的数据
   *
   * @param isWeek
   * @returns {Promise<void>}
   */
  getFlowData = async (isWeek) => {
    const { dateCycle } = this.state()
      .get('dateRange')
      .toJS();
    const { res } = await webapi.getFlowData(dateCycle, isWeek);
    if (res && res.code == Const.SUCCESS_CODE) {
      this.dispatch('flow:getFlowData', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 修改当前折线图表选择的是天，还是周
   * @param weekly
   */
  setCurrentChartWeekly = (weekly) => {
    this.dispatch('flow:setChartWeekly', weekly);
  };

  /**
   * 获取周是否可以显示
   * @param startTime
   * @param endTime
   * @returns {boolean}
   */
  getWeeklyDisplay = (startTime, endTime) => {
    const startStamp = new Date(startTime).getTime();
    const endStamp = new Date(endTime).getTime();
    const range = endStamp - startStamp;
    if (range >= 0) {
      if (range > 8 * 24 * 60 * 60 * 1000) {
        return true;
      } else {
        return false;
      }
    }
  };
}
