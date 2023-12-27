import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { message, Modal } from 'antd';

import moment from 'moment';
import { cache, checkAuth, Const } from 'qmkit';
import * as webapi from './webapi';
import TodoItemsActor from './actor/todo-items-actor';
import DataBoardActor from './actor/data-board';
import ShowBoardActor from './actor/show-board';
import ShowTodoActor from './actor/show-todo';
import OverViewBoardActor from './actor/overview-board';
import RankingActor from './actor/ranking-actor';
import ReportActor from './actor/report-actor';
import TrendActor from './actor/trend-actor';
import HomeAuthActor from './actor/home-auth-actor';
import HeaderActor from './actor/header-actor';
import SettlementActor from './actor/settlement-actor';
import EvaluateSumActor from './actor/evaluate-sum-actor';

const SUCCESS = Modal.success;

const dataBoardUi = {
  f_trade_watch_1: [
    {
      label: '交易概况',
      dataKey: 'tradeOview',
      priority: 2,
      onOff: true,
      isOview: true
    },
    { label: '交易报表', dataKey: 'tradeReport', priority: 6, onOff: true },
    { label: '交易趋势', dataKey: 'tradeTrends', priority: 9, onOff: true }
  ],
  f_flow_watch_1: [
    {
      label: '流量概况',
      dataKey: 'trafficOview',
      priority: 1,
      onOff: true,
      isOview: true
    },
    { label: '流量报表', dataKey: 'trafficReport', priority: 5, onOff: true },
    { label: '流量趋势', dataKey: 'trafficTrends', priority: 8, onOff: true }
  ],
  f_goods_watch_1: [
    {
      label: '商品概况',
      dataKey: 'skuOview',
      priority: 3,
      onOff: true,
      isOview: true
    },
    {
      label: '商品销量排行',
      dataKey: 'skuSaleRanking',
      priority: 11,
      onOff: true
    }
  ],
  f_customer_watch_1: [
    {
      label: '客户概况',
      dataKey: 'customerOview',
      priority: 4,
      onOff: true,
      isOview: true
    },
    {
      label: '客户增长报表',
      dataKey: 'customerGrowthReport',
      priority: 7,
      onOff: true
    },
    {
      label: '客户增长趋势',
      dataKey: 'customerGrowthTrends',
      priority: 10,
      onOff: true
    },
    {
      label: '客户订单排行',
      dataKey: 'customerOrderRanking',
      priority: 12,
      onOff: true
    }
  ],
  f_employee_watch_1: [
    {
      label: '业务员业绩排行',
      dataKey: 'employeeAchieve',
      priority: 13,
      onOff: true
    }
  ]
};

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    (window as any)._store = this;
  }

  bindActor() {
    return [
      new TodoItemsActor(),
      new DataBoardActor(),
      new ShowBoardActor(),
      new ShowTodoActor(),
      new OverViewBoardActor(),
      new RankingActor(),
      new ReportActor(),
      new TrendActor(),
      new HomeAuthActor(),
      new HeaderActor(),
      new SettlementActor(),
      new EvaluateSumActor()
    ];
  }

  /**
   * 初始化
   */
  init = async () => {
    //主页面头部展示
    const noop = new Promise((resolve) => resolve());
    const param = {} as any;
    param.scoreCycle = 2;
    const results = (await Promise.all([
      webapi.queryStoreState(),
      webapi.employee(),
      webapi.todoTrade(),
      webapi.todoReturn(),
      webapi.todoGoods(),
      webapi.todoAuth(),
      checkAuth('f_flow_watch_1') ? webapi.flowOview() : noop,
      checkAuth('f_trade_watch_1') ? webapi.tradeOView() : noop,
      checkAuth('f_goods_watch_1') ? webapi.skuOView() : noop,
      checkAuth('f_customer_watch_1') ? webapi.customerOView() : noop,
      checkAuth('f_flow_watch_1') ? webapi.flowReport() : noop,
      checkAuth('f_flow_watch_1') ? webapi.flowTrend() : noop,
      checkAuth('f_trade_watch_1') ? webapi.tradeReport() : noop,
      checkAuth('f_trade_watch_1') ? webapi.tradeTrend() : noop,
      checkAuth('f_customer_watch_1') ? webapi.customerGrowReport() : noop,
      checkAuth('f_customer_watch_1') ? webapi.customerGrowTrend() : noop,
      checkAuth('f_goods_watch_1') ? webapi.skuRanking() : noop,
      checkAuth('f_customer_watch_1') ? webapi.customerTop10() : noop,
      checkAuth('f_employee_watch_1') ? webapi.employeeTop10() : noop,
      webapi.queryToTalSettlement(),
      webapi.fetchStoreEvaluateSum(param)
    ])) as any;
    if (
      results[0] &&
      results[0].res &&
      results[0].res.code === Const.SUCCESS_CODE
    ) {
      const result = results[0].res.context;
      const overDueDay = result.overDueDay;
      /**
       * 店铺状态 0、开启 1、关店
       */
      let header = {
        preTxt: '',
        errTxt: '',
        postTxt: '',
        midErr: '',
        lastTxt: '',
        text: `店铺有效期至 ${moment(result.contractEndDate).format(
          Const.TIME_FORMAT
        )}`
      };
      switch (result.storeState) {
        /**开启*/
        case 0:
          //开店，未过期，则正常营业
          if (overDueDay >= 9) {
            header.preTxt = '店铺营业中';
          } else {
            if (overDueDay >= 0) {
              header.preTxt = '店铺还有';
              header.errTxt = overDueDay + 1;
              header.postTxt =
                '天过期，过期后，您将无法再销售商品，您的店铺也将无法正常展示，请尽快联系平台续签';
            } else {
              header.errTxt = '店铺已过期';
              header.postTxt = '，请尽快联系平台续签';
            }
          }
          this.dispatch('common: header', header);
          break;
        /**关店*/
        case 1:
          header.errTxt = '店铺已关店';
          header.postTxt = '，原因是：';
          header.midErr = result.storeClosedReason;
          header.lastTxt = '，如有问题请联系平台';
          this.dispatch('common: header', header);
          break;
      }
    }

    //员工信息
    this.dispatch('home-actor:setEmployee', results[1].res);
    //订单todo
    if (
      results[2] &&
      results[2].res &&
      results[2].res.code === Const.SUCCESS_CODE
    ) {
      this.dispatch('home-todo-actor:setTradeTodo', results[2].res.context);
    }
    //退单todo
    if (
      results[3] &&
      results[3].res &&
      results[3].res.code === Const.SUCCESS_CODE
    ) {
      this.dispatch('home-todo-actor:setReturnTodo', results[3].res.context);
    }
    //商品todo
    if (
      results[4] &&
      results[4].res &&
      results[4].res.code === Const.SUCCESS_CODE
    ) {
      this.dispatch('home-todo-actor:setGoodsTodo', results[4].res.context);
    }
    //待处理事项业务权限
    let todoItems = {};
    results[5].res.forEach((todo: string) => {
      todoItems[todo] = true;
    });
    if (results[5].res.length === 0) {
      todoItems['todoVisible'] = false;
    }
    this.dispatch('show-todo-actor:mergeShowTodo', fromJS(todoItems));
    //流量概况
    if (
      results[6] &&
      results[6].res &&
      results[6].res.code === Const.SUCCESS_CODE
    ) {
      let flow = results[6].res.context.content[0];
      if (flow) {
        let flowOview = {
          trafficNum: {
            totalPv: flow.totalPv,
            totalUv: flow.totalUv,
            skuTotalPv: flow.skuTotalPv,
            skuTotalUv: flow.skuTotalUv
          }
        };
        this.dispatch('overview-board-actor:mergeBoards', flowOview);
      }
    }
    //交易概况
    if (
      results[7] &&
      results[7].res &&
      results[7].res.code === Const.SUCCESS_CODE
    ) {
      let trade = results[7].res.context;
      this.dispatch('overview-board-actor:mergeBoards', {
        tradeNum: {
          orderCount: trade.orderCount,
          orderAmt: trade.orderAmt,
          payOrderCount: trade.payOrderCount,
          payOrderAmt: trade.payOrderAmt
        }
      });
    }
    //商品概况数据
    if (
      results[8] &&
      results[8].res &&
      results[8].res.code === Const.SUCCESS_CODE
    ) {
      this.dispatch('overview-board-actor:mergeBoards', {
        skuNum: results[8].res.context
      });
    }
    //客户概况
    if (
      results[9] &&
      results[9].res &&
      results[9].res.code === Const.SUCCESS_CODE
    ) {
      let data = results[9].res.context.data[0];
      if (data) {
        this.dispatch('overview-board-actor:mergeBoards', {
          customerNum: {
            cusAllCount: data.customerAllCount,
            cusDayGrowthCount: data.customerDayGrowthCount,
            cusDayRegisterCount: data.customerDayRegisterCount
          }
        });
      }
    }
    //流量报表 近10日
    if (
      results[10] &&
      results[10].res &&
      results[10].res.code === Const.SUCCESS_CODE
    ) {
      let content = results[10].res.context.content;
      let flowData = content.map((flow, index) => {
        return {
          key: index,
          totalPv: flow.totalPv,
          totalUv: flow.totalUv,
          skuTotalPv: flow.skuTotalPv,
          skuTotalUv: flow.skuTotalUv,
          date: flow.date
        };
      });
      this.dispatch('report-actor:mergeReport', fromJS({ flowData: flowData }));
    }
    //流量趋势 近10日
    if (
      results[11] &&
      results[11].res &&
      results[11].res.code === Const.SUCCESS_CODE
    ) {
      let flowList = results[11].res.context.flowList;
      const length = flowList.length;
      let flowTrendData = flowList
        .slice(length - 10, length)
        .map((flow, index) => {
          return {
            key: index,
            totalPv: flow.totalPv,
            totalUv: flow.totalUv,
            skuTotalPv: flow.skuTotalPv,
            skuTotalUv: flow.skuTotalUv,
            title: flow.title
          };
        });
      this.dispatch(
        'trend-actor:mergeTrend',
        fromJS({ flowTrendData: flowTrendData })
      );
    }
    //交易报表 近10日
    if (
      results[12] &&
      results[12].res &&
      results[12].res.code === Const.SUCCESS_CODE
    ) {
      let content = results[12].res.context.content;
      let tradeData = content.map((order, index) => {
        return {
          key: index,
          orderCount: order.orderCount,
          orderAmt: order.orderAmt,
          payOrderCount: order.PayOrderCount,
          payOrderAmt: order.payOrderAmt,
          title: order.title
        };
      });
      this.dispatch(
        'report-actor:mergeReport',
        fromJS({ tradeData: tradeData })
      );
    }
    //交易趋势 近10日
    if (
      results[13] &&
      results[13].res &&
      results[13].res.code === Const.SUCCESS_CODE
    ) {
      let context = results[13].res.context;
      const length = context.length;
      let tradeTrendData = context
        .slice(length - 10, length)
        .map((order, index) => {
          return {
            key: index,
            orderCount: order.orderCount,
            orderAmt: order.orderAmt,
            payOrderCount: order.PayOrderCount,
            payOrderAmt: order.payOrderAmt,
            title: order.title
          };
        });
      this.dispatch(
        'trend-actor:mergeTrend',
        fromJS({ tradeTrendData: tradeTrendData })
      );
    }
    //客户增长报表
    if (
      results[14] &&
      results[14].res &&
      results[14].res.code === Const.SUCCESS_CODE
    ) {
      let data = results[14].res.context.data;
      let customerData = data.map((cus, index) => {
        return {
          key: index,
          cusAllCount: cus.customerAllCount,
          cusDayGrowthCount: cus.customerDayGrowthCount,
          cusDayRegisterCount: cus.customerDayRegisterCount,
          baseDate: cus.baseDate
        };
      });
      this.dispatch(
        'report-actor:mergeReport',
        fromJS({ customerData: customerData })
      );
    }
    //客户增长趋势图
    if (
      results[15] &&
      results[15].res &&
      results[15].res.code === Const.SUCCESS_CODE
    ) {
      let context = results[15].res.context;
      let customerTrendData = context.map((cus, index) => {
        return {
          key: index,
          title: cus.xValue,
          cusAllCount: cus.customerAllCount,
          cusDayGrowthCount: cus.customerDayGrowthCount,
          cusDayRegisterCount: cus.customerDayRegisterCount
        };
      });
      this.dispatch(
        'trend-actor:mergeTrend',
        fromJS({ customerGrowTrendData: customerTrendData })
      );
    }
    //商品销售排行Top10
    if (
      results[16] &&
      results[16].res &&
      results[16].res.code === Const.SUCCESS_CODE
    ) {
      this.dispatch('ranking-actor:setSkuRanking', {
        goodsSkuViewList: results[16].res.context.goodsSkuViewList,
        goodsReportList: results[16].res.context.goodsReportList
      });
    }
    //客户订货排行TOP10
    if (
      results[17] &&
      results[17].res &&
      results[17].res.code === Const.SUCCESS_CODE
    ) {
      let data = results[17].res.context.data;
      let customerRanking = data
        ? data.map((cus, index) => {
            return {
              key: index,
              serialNumber: index + 1,
              customerName: cus.customerName,
              tradeNum: cus.orderCount,
              tradeAmount: cus.amount
            };
          })
        : [];
      this.dispatch('ranking-actor:setCustomerRanking', customerRanking);
    }
    //业务员业绩排行TOP10
    if (
      results[18] &&
      results[18].res &&
      results[18].res.code === Const.SUCCESS_CODE
    ) {
      let viewList = results[18].res.context.viewList;
      viewList = viewList.map((employee, index) => {
        return {
          key: index,
          serialNumber: index + 1,
          employeeName: employee.employeeName,
          orderCount: employee.orderCount,
          amount: employee.amount,
          payCount: employee.payCount,
          payAmount: employee.payAmount
        };
      });
      this.dispatch('ranking-actor:setEmployeeRanking', viewList);
    }
    if (
      results[19] &&
      results[19].res &&
      results[19].res.code === Const.SUCCESS_CODE
    ) {
      let settlement = results[19].res.context;
      this.dispatch('settlement: set', settlement);
    }

    if (
      results[20] &&
      results[20].res &&
      results[20].res.code === Const.SUCCESS_CODE
    ) {
      this.dispatch(
        'storeEvaluateSum:init',
        results[20].res.context.storeEvaluateSumVO || {}
      );
    }
    this.freshDataBoard();
  };

  /**
   * 刷新主页控制看板
   */
  freshDataBoard = async () => {
    const accountName = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
      .accountName;
    const cacheData = JSON.parse(
      localStorage.getItem(cache.DATA_BOARD.concat(accountName))
    );
    //看板是否生效数据结构{看板key:true/false}
    let showBoards = {};

    //新的业务权限
    let newServiceAuth = [];
    //查询统计菜单业务权限
    const { res } = await webapi.statisticsAuth();
    newServiceAuth = res;

    //数据看板
    let updateCache = {};
    updateCache['oldServiceAuth'] = newServiceAuth;

    //看板索引结构{boardKey:index},用于查询指定看板的state
    let boardIndex = {};

    //近日概况看板数量(控制看板样式)
    let oViewNum = 0;

    if (!cacheData) {
      updateCache['dataAuth'] = fromJS(newServiceAuth).flatMap((service) => {
        return dataBoardUi[service];
      });
    } else {
      //invalid业务权限
      let oldAuth = cacheData['oldServiceAuth'].filter(
        (service) => newServiceAuth.indexOf(service) < 0
      );
      //新增的业务权限
      let newAuth = newServiceAuth.filter(
        (service) => cacheData['oldServiceAuth'].indexOf(service) < 0
      );
      if (oldAuth.length == 0 && newAuth.length == 0) {
        //sort by 看板展示优先等级
        cacheData['dataAuth'] = cacheData['dataAuth'].sort(
          (board, board1) => board.priority - board1.priority
        );
        //build index
        cacheData['dataAuth'].forEach((board, i) => {
          boardIndex[board.dataKey] = i;
          showBoards[board.dataKey] = board['onOff'];
        });

        //计算显示的概况数量
        cacheData['dataAuth'].forEach((board) => {
          if (board['isOview'] == true && board['onOff'] == true) {
            ++oViewNum;
          }
        });
        this.transaction(() => {
          this.dispatch('data-board-actor:setDataBoard', cacheData['dataAuth']);
          this.dispatch('data-board-actor:setBoardIndex', boardIndex);
          this.dispatch('show-board-actor:mergeBoards', showBoards);
          this.dispatch('data-board-actor:setOViewNum', oViewNum);
        });

        return;
      } else {
        //update 数据面板
        oldAuth.forEach((auth) => {
          cacheData['dataAuth']
            .filter((data) =>
              (dataBoardUi[auth] || fromJS([])).some(
                (data1) => data1['dataKey'] === data['dataKey']
              )
            )
            .forEach((data) =>
              cacheData['dataAuth'].splice(
                cacheData['dataAuth'].indexOf(data),
                1
              )
            );
        });

        newAuth.forEach((auth) => {
          cacheData['dataAuth'].push(...dataBoardUi[auth]);
        });

        updateCache['dataAuth'] = cacheData['dataAuth'];
      }
    }

    //sort by 看板展示优先等级
    updateCache['dataAuth'] = updateCache['dataAuth'].sort(
      (board, board1) => board.priority - board1.priority
    );
    //build index
    updateCache['dataAuth'].forEach((board, i) => {
      boardIndex[board.dataKey] = i;
      showBoards[board.dataKey] = board['onOff'];
    });
    //计算显示的概况数量
    updateCache['dataAuth'].forEach((board) => {
      if (board['isOview'] == true && board['onOff'] == true) {
        ++oViewNum;
      }
    });
    this.transaction(() => {
      this.dispatch('data-board-actor:setDataBoard', updateCache['dataAuth']);
      this.dispatch('data-board-actor:setBoardIndex', boardIndex);
      this.dispatch('show-board-actor:mergeBoards', showBoards);
      this.dispatch('data-board-actor:setOViewNum', oViewNum);
    });
    //重置主页控制面板
    localStorage.setItem(
      cache.DATA_BOARD.concat(accountName),
      JSON.stringify(updateCache)
    );
  };

  /**
   * 配置数据权限
   * @param key
   * @param checked
   */
  changeDataBoard = (key: string, checked: boolean) => {
    const index = this.state().getIn(['boardIndex', key]);

    this.transaction(() => {
      this.dispatch('data-board-actor:switchDataBoard', { index, checked });
    });

    //数据看板
    const accountName = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
      .accountName;
    const cacheData = fromJS(
      JSON.parse(localStorage.getItem(cache.DATA_BOARD.concat(accountName)))
    ).updateIn(['dataAuth', index], (val) => {
      if (val.get('isOview') == true) {
        this.dispatch('data-board-actor:updateOViewNum', checked);
      }
      return val.set('onOff', checked);
    });

    localStorage.setItem(
      cache.DATA_BOARD.concat(accountName),
      JSON.stringify(cacheData)
    );

    //
    this.dispatch('show-board-actor:switchBoard', key);
  };

  /**
   * 登录
   * @param code
   * @returns {Promise<void>}
   */
  login = async (code: string) => {
    const { res } = (await webapi.login(code)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('home-auth-actor:setAuthVisible', false);
        this.dispatch('home-auth-actor:setAuthTipVisible', true);
        this.dispatch('home-auth-actor:init', res.context);
      });
      const periodOfValidity = this.state().getIn([
        'session',
        'sessionInfo',
        'snInfo',
        'periodOfValidity'
      ]);
      const content = `当前有效期为:${periodOfValidity}`;
      SUCCESS({
        title: '您的授权码验证成功！',
        content: content,
        width: 480,
        okText: '好的'
      });
    } else {
      message.error(res.message);
      await webapi.logout();
      this.dispatch('home-auth-actor:init', {});
    }
  };
  /**
   * 关闭授权tip
   */
  closeAuthTip = () => {
    this.dispatch('home-auth-actor:setAuthTipVisible', false);
  };
}
