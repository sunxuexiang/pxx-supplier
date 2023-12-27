/**
 * Created by feitingting on 2017/10/16.
 */

import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import moment from 'moment';

import { Const } from 'qmkit';

import * as webapi from './webapi';
import ModalActor from './actor/modal-actor';
import ChartActor from './actor/chart-actor';
import GeneralActor from './actor/general-actor';
import TableActor from './actor/table-actor';

let desc = new Array();
desc.push({ title: '下单金额', key: 'orderAmt' });

const defaultColumns = [
  {
    title: '下单笔数',
    key: 'orderCount',
    dataIndex: 'orderCount',
    sorter: true
  },
  { title: '下单人数', key: 'orderNum', dataIndex: 'orderNum', sorter: true },
  { title: '下单金额', key: 'orderAmt', dataIndex: 'orderAmt', sorter: true },
  {
    title: '付款订单数',
    key: 'PayOrderCount',
    dataIndex: 'PayOrderCount',
    sorter: true
  },
  {
    title: '付款人数',
    key: 'PayOrderNum',
    dataIndex: 'PayOrderNum',
    sorter: true
  },
  {
    title: '付款金额',
    key: 'payOrderAmt',
    dataIndex: 'payOrderAmt',
    sorter: true
  }
];

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new ModalActor(),
      new ChartActor(),
      new TableActor(),
      new GeneralActor()
    ];
  }

  downChart = () => {
    this.transaction(() => {
      this.dispatch('modal:show');
    });
  };

  onCancel = () => {
    this.dispatch('modal:hide');
  };

  /**
   * 初始化展示当天的交易趋势
   */
  init = async () => {
    const today = moment()
      .format(Const.DAY_FORMAT)
      .toString();
    this.transaction(() => {
      //表格默认显示的栏目
      this.dispatch('trade:columns', defaultColumns);
      this.dispatch('trade:recommend', defaultColumns);
      this.dispatch('trade:desc', desc);
      this.dispatch('trade:startDate', today);
      this.dispatch('trade:endDate', today);
      this.dispatch('trade:selectType', 0);
    });
    this.setDateRange(today, today, 0);
  };

  /**
   * 页面时间范围
   * @param startDate
   * @param endDate
   */
  setDateRange = async (
    startDate: string,
    endDate: string,
    selectType: number
  ) => {
    const weekly = this.state().get('weekly');
    if (weekly) {
      if (this.getWeeklyDisplay(startDate, endDate)) {
        await this.getTradeChart(selectType, true);
      } else {
        this.setCurrentChartWeekly(false);
        await this.getTradeChart(selectType, false);
      }
    } else {
      await this.getTradeChart(selectType, false);
    }
    await this.getTradeGeneral(selectType);
    await this.getTradeTable(selectType);
  };

  /**
   * 获取给定日期范围内的交易概况
   * @param startDate
   * @param endDate
   * @returns {Promise<void>}
   */
  getTradeGeneral = async (selectType) => {
    //获取当天的交易概况
    const { res: tradeGeneral } = await webapi.getTradeGeneral({
      //companyId: 1,
      selectType: selectType,
      isWeek: false
    });
    if (tradeGeneral.code == Const.SUCCESS_CODE) {
      //如果是无数据的状态
      if (tradeGeneral.context.isNull == true) {
        this.dispatch('trade:isNull', true);
      } else {
        this.dispatch('trade:isNull', false);
        this.dispatch('trade:general', tradeGeneral.context);
      }
    } else {
      message.error('交易概况获取失败');
    }
  };

  /**
   * 获取给定日期范围内的交易趋势
   * @param startDate
   * @param endDate
   * @returns {Promise<void>}
   */
  getTradeChart = async (selectType, isWeek) => {
    this.setCurrentChartWeekly(isWeek);
    const { res: tradeChart } = await webapi.getTradeView({
      //companyId: 1,
      selectType: selectType,
      isWeek: isWeek
    });
    if (tradeChart.code == Const.SUCCESS_CODE) {
      this.dispatch('trade:chart', tradeChart.context);
    } else {
      message.error('交易趋势获取失败');
    }
  };

  /**
   * 获取给定日期范围内的交易报表
   * @param startDate
   * @param endDate
   * @returns {Promise<void>}
   */
  getTradeTable = async (selectType) => {
    const { res: tradeTable } = await webapi.getTradePage({
      //companyId: 1,
      selectType: selectType,
      isWeek: false,
      pageNum: this.state().get('pageNum'),
      pageSize: this.state().get('pageSize'),
      sortName:
        this.state().get('sortedName') == 'title'
          ? 'date'
          : this.state().get('sortedName'),
      sortOrder: this.state().get('sortedOrder') == 'descend' ? 'DESC' : 'ASC'
    });
    if (tradeTable.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('trade:table', tradeTable.context.content);
        this.dispatch(
          'trade:total',
          tradeTable.context.totalPages * this.state().get('pageSize')
        );
      });
    } else {
      message.error('交易报表获取失败');
    }
  };

  /**
   * 切换时间时获取各个指标数据
   * @param param
   * @returns {Promise<void>}
   */
  getTradeInfo = async (param) => {
    const [startDate, endDate, index] = param;
    this.transaction(() => {
      //全局日期范围
      this.dispatch('trade:startDate', startDate);
      this.dispatch('trade:endDate', endDate);
      this.dispatch('trade:selectType', index);
      //弹框隐藏
      this.dispatch('trade:hideModal');
    });
    this.setDateRange(startDate, endDate, index);
  };

  /**
   * 分页处理
   * @param pageNum
   * @param pageSize
   * @returns {Promise<void>}
   */
  onPagination = async (pageNum, pageSize, sortName, sortOrder) => {
    let sortedName = sortName ? sortName : 'date';
    let sortedOrder = sortName
      ? sortOrder == 'ASC'
        ? 'ascend'
        : 'descend'
      : 'descend';
    //给定时间范围内的交易报表
    const { res } = await webapi.getTradePage({
      //companyId: 1,
      selectType: this.state().get('selectType'),
      sortName: sortedName,
      sortOrder: sortName ? sortOrder : 'DESC',
      pageNum: pageNum,
      pageSize: pageSize
    });
    if (res.code == Const.SUCCESS_CODE) {
      //将被排序的名称和规则存储起来
      this.dispatch(
        'trade:sortName',
        sortedName == 'date' ? 'title' : sortedName
      );
      this.dispatch('trade:sortOrder', sortedOrder);
      this.dispatch('trade:table', (res as any).context.content);
      this.dispatch('trade:current', pageNum);
      this.dispatch('trade:total', res.context.totalPages * pageSize);
      this.dispatch('trade:pageSize', pageSize);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 选中自定义指标
   * @param value
   */
  changeColumn = async (value: any) => {
    if (value) {
      let count = 0;
      const newColumns = value;
      newColumns.map((v) => {
        v.dataIndex = v.key;
        if (v.key == this.state().get('sortedName')) {
          count++;
        }
      });
      this.dispatch('trade:columns', newColumns);
      //上一次的排序指已经取消勾选
      if (count == 0) {
        await this.onPagination(1, this.state().get('pageSize'), '', '');
      }
    } else {
      this.dispatch('trade:columns', defaultColumns);
    }
  };

  /**
   * 趋势图自定义指标项更改
   * @param value
   */
  changeDesc = (value) => {
    //选择一个的时候，多Y轴属性设为false
    if (value.length == 1) {
      this.transaction(() => {
        this.dispatch('trade:desc', value);
        this.dispatch('trade:multiYaxis', false);
      });
    } else {
      this.transaction(() => {
        this.dispatch('trade:desc', value);
        this.dispatch('trade:multiYaxis', true);
      });
    }
  };

  /**
   * 修改当前折线图表选择的是天，还是周
   * @param weekly
   */
  setCurrentChartWeekly = (weekly) => {
    this.dispatch('trade:setChartWeekly', weekly);
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

  /**
   * 隐藏弹框
   */
  hideModal = () => {
    this.dispatch('trade:hideModal');
  };

  /**
   * 显示弹框
   */
  showModal = () => {
    this.dispatch('trade:showModal');
  };
}
