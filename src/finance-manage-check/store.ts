/**
 * Created by feitingting on 2017/12/12.
 */
import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { Const, util } from 'qmkit';
import * as webapi from './webapi';
import FinanceActor from './actor/finance-actor';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FinanceActor()];
  }

  init = async () => {
    const { res } = await webapi.fetchAllPayWays();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:payWays', res.context);
    }
    //获取收入对账明细
    const searchTime = {
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59'
    };
    this.dispatch('finance:searchTime', fromJS(searchTime));
    await this.fetchIncomeList();
  };

  /**
   * 获取收入对账列表
   */
  fetchIncomeList = async () => {
    const { res: income } = await webapi.fetchIncomeList({
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59'
    });
    //总体
    const { res: incomeTotal } = await webapi.fetchIncomeTotal({
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59'
    });
    if (income.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:income', income.context.content);
    } else {
      message.error(income.message);
    }
    if (incomeTotal.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:incomeTotal', incomeTotal.context);
    }
  };

  /**
   * 改变时间
   * @param params
   */
  changeDateRange = (field, value) => {
    this.dispatch('finance:dateRange', { field, value });
  };

  /**
   * 根据日期搜索
   */
  searchByDate = async () => {
    const searchTime = {
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59'
    };
    this.dispatch('finance:searchTime', fromJS(searchTime));
    if (this.state().get('tabKey') == 1) {
      await this.fetchIncomeList();
    } else {
      await this.fetchRefundList();
    }
  };

  /**
   * 切换选项卡
   */
  onTabChange = async (key) => {
    this.dispatch('finance:tabkey', key);
    //zhanghao 原型修改，时间不需要重置
    //时间还原为当天
    // this.changeDateRange('beginTime', moment(new Date()).format('YYYY-MM-DD'));
    // this.changeDateRange('endTime', moment(new Date()).format('YYYY-MM-DD'));
    //收入对账
    if (key == 1) {
      await this.fetchIncomeList();
    } else {
      //退款对账
      await this.fetchRefundList();
    }
  };

  /**
   * 获取退款对账列表
   */
  fetchRefundList = async () => {
    const { res: refund } = await webapi.fetchRefundList({
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59'
    });
    const { res: refundTotal } = await webapi.fetchRefundTotal({
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59'
    });
    if (refundTotal.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:refundTotal', refundTotal.context);
    }
    if (refund.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:refund', refund.context.content);
    } else {
      message.error(refund.message);
    }
  };

  /**
   * 批量导出
   */
  bulk_export = async () => {
    const searchTime = this.state()
      .get('searchTime')
      .toJS();
    const { beginTime, endTime } = searchTime;
    const keywords = this.state().get('storeName');
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            keywords: keywords,
            beginTime: beginTime,
            endTime: endTime,
            token: token
          });
          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref =
            Const.HOST + `/finance/bill/exportIncome/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  /**
   * 对账明细页面返回的时候，保持原来的日期和tab位置
   */
  setParams = async (kind: string) => {
    this.dispatch('finance:params', kind);
    const { res } = await webapi.fetchAllPayWays();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:payWays', res.context);
    }
    //根据种类获取相应的对账列表
    if (kind == 'income') {
      await this.fetchIncomeList();
    } else {
      await this.fetchRefundList();
    }
  };
}
