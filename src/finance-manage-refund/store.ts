/**
 * Created by feitingting on 2017/12/13.
 */

import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { Const, util } from 'qmkit';
import DetailActor from './actor/detail-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new DetailActor()];
  }

  /**
   * 初始化
   * @param sid
   * @param kind
   */
  init = async ({ sid, kind, beginTime, endTime }) => {
    this.dispatch('detail:init', { sid, kind, beginTime, endTime });
    //所有支付方式
    const { res } = await webapi.fetchAllPayWays();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('detail:payWays', res.context);
    }
    if (kind == 'income') {
      //收入对账明细
      await this.getIncomeDetail();
    } else {
      await this.getRefundDetail();
    }
  };

  /**
   * 收入明细
   * @returns {Promise<void>}
   */
  getIncomeDetail = async () => {
    const { res } = await webapi.fetchIncomeDetail({
      storeId: this.state().get('storeId'),
      payWay: this.state().get('incomePayWay')
        ? this.state().get('incomePayWay')
        : null,
      tradeNo: this.state().get('tradeNo'),
      beginTime: this.state().get('beginTime'),
      endTime: this.state().get('endTime'),
      pageNum: this.state().get('pageNum')
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        //总数
        this.dispatch(
          'detail:total',
          res.context.totalPages * res.context.size
        );
        this.dispatch('detail:income', res.context.content);
      });
    }
  };

  /**
   * 退款明细
   * @returns {Promise<void>}
   */
  getRefundDetail = async () => {
    const { res } = await webapi.fetchRefundDetail({
      storeId: this.state().get('storeId'),
      payWay: this.state().get('refundPayWay')
        ? this.state().get('refundPayWay')
        : null,
      tradeNo: this.state().get('tradeNo'),
      beginTime: this.state().get('beginTime'),
      endTime: this.state().get('endTime'),
      pageNum: this.state().get('pageNum')
    });
    if (res.code == Const.SUCCESS_CODE) {
      //总数
      this.dispatch('detail:total', res.context.totalPages * res.context.size);
      this.dispatch('detail:refund', res.context.content);
    }
  };

  /**
   * 支付方式下拉改变
   * @param value
   */
  changePayWay = async (value) => {
    const kind = this.state().get('kind');
    //都从第一页开始
    this.dispatch('detail:pageNum', 0);
    if (kind == 'income') {
      this.dispatch('detail:income:payWay', value);
      //收入对账明细
      await this.getIncomeDetail();
    } else {
      this.dispatch('detail:refund:payWay', value);
      await this.getRefundDetail();
    }
  };

  /**
   * 按交易流水号查询
   * @param value
   */
  changeTradeNo = async (value) => {
    const kind = this.state().get('kind');
    //都从第一页开始
    this.dispatch('detail:pageNum', 0);
    this.dispatch('detail:tradeNo', value.trim());
    if (kind == 'income') {
      await this.getIncomeDetail();
    } else {
      await this.getRefundDetail();
    }
  };

  /**
   * 导出收入对账明细
   */
  exportIncomeDetail = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({
            payWay: this.state().get('incomePayWay'),
            storeId: this.state().get('storeId'),
            beginTime: this.state().get('beginTime'),
            endTime: this.state().get('endTime'),
            tradeNo: this.state().get('tradeNo'),
            token: token
          });
          let encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref =
            Const.HOST + `/finance/bill/income/details/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  /**
   * 导出退款对账明细
   */
  exportRefundDetail = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({
            payWay: this.state().get('refundPayWay'),
            storeId: this.state().get('storeId'),
            beginTime: this.state().get('beginTime'),
            endTime: this.state().get('endTime'),
            tradeNo: this.state().get('tradeNo'),
            token: token
          });
          let encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref =
            Const.HOST + `/finance/bill/refund/details/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  /**
   * 分页查询
   * @param pageNum
   * @param pageSize
   */
  onPagination = async (current, _pageSize) => {
    this.dispatch('detail:pageNum', current - 1);
    if (this.state().get('kind') == 'income') {
      await this.getIncomeDetail();
    } else {
      await this.getRefundDetail();
    }
  };
}
