import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { Const, util } from 'qmkit';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import SettleActor from './actor/settle-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettleActor()];
  }

  init = async () => {
    const { res } = await webapi.getStoreInfo();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('settleStore:accountDay', res.context.accountDay);
    }
    this.fetchSettleList(0, 10);
  };

  /**
   * 查询结算单明细
   * @returns {Promise<void>}
   */
  fetchSettleList = async (pageNum = null, pageSize = null) => {
    let queryParams = this.state()
      .get('queryParams')
      .toJS();
    queryParams['startTime'] = queryParams['startTime']
      .format('YYYY-MM-DD')
      .toString();
    queryParams['endTime'] = queryParams['endTime']
      .format('YYYY-MM-DD')
      .toString();
    if (pageNum) {
      queryParams['pageNum'] = pageNum;
    }
    if (pageSize) {
      queryParams['pageSize'] = pageSize;
    }
    const { res } = await webapi.fetchSettlementList(queryParams);
    this.dispatch('settleStore:settleQueryParams', fromJS(queryParams));
    if (res.code == Const.SUCCESS_CODE) {
      res.context.content.forEach((item) => {
        if (!item.commonCouponPrice) {
          item.commonCouponPrice = '-';
        }
        if (!item.pointPrice) {
          item.pointPrice = '-';
        }
        if (!item.commissionPrice) {
          item.commissionPrice = '-';
        }
      });
      this.dispatch('settle:list', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 修改结算单状态
   * @param settleIdArray
   * @param status
   * @returns {Promise<void>}
   */
  changeSettleStatus = async (settleIdArray, status) => {
    const { res } = await webapi.changeSettleStatus(settleIdArray, status);
    if (res.code == Const.SUCCESS_CODE) {
      this.fetchSettleList();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 保存当前的查询条件
   * @param key
   * @param value
   */
  storeQueryParams = (key, value) => {
    this.dispatch('settle:queryParams', { key: key, value: value });
  };

  /**
   * tab切换方法
   * @param tabKey
   */
  onTabChange = (tabKey) => {
    this.transaction(() => {
      this.storeQueryParams('settleStatus', tabKey);
      this.fetchSettleList();
    });
  };

  /**
   * 根据店铺名称查询店铺
   * @param storeName
   * @returns {Promise<void>}
   */
  queryStoreByName = async (storeName) => {
    const { res } = await webapi.queryStoreByName(storeName);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('settle:storeMap', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * checkbox勾选事件
   * @param idString
   */
  setCheckedSettleIds = (idArray) => {
    this.dispatch('settle:setCheckedSettleIds', idArray);
  };

  /**
   * 批量导出
   */
  bulkExport = async () => {
    const queryParams = this.state()
      .get('settleQueryParams')
      .toJS();
    const { startTime, endTime } = queryParams;
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            startTime: startTime,
            endTime: endTime,
            token: token
          });
          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref =
            Const.HOST + `/finance/settlement/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }
        resolve();
      }, 500);
    });
  };
}
