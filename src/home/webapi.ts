import { Fetch } from 'qmkit';

/**
 * 订单todo
 * @returns {Promise<IAsyncResult<T>>}
 */
export const todoTrade = () => {
  return Fetch('/todo/trade');
};

/**
 * 退单todo
 * @returns {Promise<IAsyncResult<T>>}
 */
export const todoReturn = () => {
  return Fetch('/todo/return');
};

/**
 * 商品todo
 * @returns {Promise<IAsyncResult<T>>}
 */
export const todoGoods = () => {
  return Fetch('/todo/goods');
};

/**
 * 员工信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const employee = () => {
  return Fetch('/customer/employee/info');
};

/**
 * 待处理事项业务权限
 */
export const todoAuth = () => {
  return Fetch<Array<string>>('/functions', {
    method: 'POST',
    body: JSON.stringify([
      'fOrderList002',
      'fOrderList001',
      'fOrderDetail002',
      'fOrderList003',
      'rolf002',
      'rolf003',
      'rolf004',
      'rolf005',
      'f_customer_3',
      'changeInvoice',
      'f_goods_check_1',
      'destoryOpenOrderInvoice'
    ])
  });
};

/**
 * 统计面板权限
 */
export const statisticsAuth = () => {
  return Fetch<Array<string>>('/functions', {
    method: 'POST',
    body: JSON.stringify([
      'f_flow_watch_1',
      'f_trade_watch_1',
      'f_goods_watch_1',
      'f_customer_watch_1',
      'f_employee_watch_1'
    ])
  });
};

/**
 * 待处理事项业务权限
 * @returns {Promise<IAsyncResult<Array<string>>>}
 */
export const serviceAuth = (menu: string) => {
  return Fetch<Array<string>>(`/customer/${menu}/functions`);
};

/**
 * 商品概况数据
 * @returns {Promise<IAsyncResult<T>>}
 */
export const skuOView = () => {
  return Fetch('/goodsReport/total', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 0
    })
  });
};

/**
 * 商品销售排行Top10
 * @returns {Promise<IAsyncResult<T>>}
 */
export const skuRanking = () => {
  return Fetch('/goodsReport/skuList', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 0,
      sortType: 1,
      sortCol: 2,
      pageNum: 1
    })
  });
};

/**
 * 交易概况
 * @returns {Promise<IAsyncResult<T>>}
 */
export const tradeOView = () => {
  return Fetch('/tradeReport/overview', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 0
    })
  });
};

/**
 * 交易报表 近10日
 * @returns {Promise<IAsyncResult<T>>}
 */
export const tradeReport = () => {
  return Fetch('/tradeReport/page', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 3
    })
  });
};

/**
 * 流量报表 近10日
 * @returns {Promise<IAsyncResult<T>>}
 */
export const flowReport = () => {
  return Fetch('/flow/page', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 3
    })
  });
};

/**
 * 交易趋势 近10日
 * @returns {Promise<IAsyncResult<T>>}
 */
export const tradeTrend = () => {
  return Fetch('/tradeReport/list', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 3
    })
  });
};

/**
 * 流量趋势 近10日
 * @returns {Promise<IAsyncResult<T>>}
 */
export const flowTrend = () => {
  return Fetch('/flow/list', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 3
    })
  });
};

/**
 * 客户增长报表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const customerGrowReport = () => {
  return Fetch('/customer_grow/page', {
    method: 'POST',
    body: JSON.stringify({
      dateCycle: 4,
      pageNum: 1,
      pageSize: 10
    })
  });
};

/**
 * 客户增长趋势图
 * @returns {Promise<IAsyncResult<T>>}
 */
export const customerGrowTrend = () => {
  return Fetch('/customer_grow/trend', {
    method: 'POST',
    body: JSON.stringify({
      queryDateCycle: 4,
      weekly: false
    })
  });
};

/**
 * 客户订货排行TOP10
 * @returns {Promise<IAsyncResult<T>>}
 */
export const customerTop10 = () => {
  return Fetch('/customer_report/order', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 1,
      queryType: 0,
      pageSize: 10,
      dateCycle: 0
    })
  });
};

/**
 * 今日客户概况
 * @returns {Promise<IAsyncResult<T>>}
 */
export const customerOView = () => {
  return Fetch('/customer_grow/page', {
    method: 'POST',
    body: JSON.stringify({
      dateCycle: 0,
      pageNum: 1,
      pageSize: 1
    })
  });
};

/**
 * 业务员业绩排行TOP10
 * @returns {Promise<IAsyncResult<T>>}
 */
export const employeeTop10 = () => {
  return Fetch('/view/employee/performance', {
    method: 'POST',
    body: JSON.stringify({
      companyId: '1',
      dataCycle: 'today',
      sort: 'ORDER_AMT_DESC',
      pageNo: '1',
      pageSize: '10'
    })
  });
};

/**
 * 流量概况
 * @returns {Promise<IAsyncResult<T>>}
 */
export const flowOview = () => {
  return Fetch('/flow/page', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 0
    })
  });
};

/**
 * 获取授权信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const session = () => {
  return Fetch<TResult>('/auth/session');
};
/**
 * 验证授权码
 * @param code
 * @returns {Promise<IAsyncResult<T>>}
 */
export const login = (code: string) => {
  return Fetch(`/auth/login/${code}`);
};
/**
 * 授权码登出
 * @returns {Promise<IAsyncResult<T>>}
 */
export const logout = () => {
  return Fetch('/auth/logout');
};

/**
 * 主页面头部展示
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const queryStoreState = () => {
  return Fetch<TResult>('/employee/store/state');
};

export const queryToTalSettlement = () => {
  return Fetch('/finance/settlement/queryToTalSettlement');
};

/**
 * 获取店铺180天评价统计信息
 * @param filterParams
 */
export function fetchStoreEvaluateSum(param = {}) {
    return Fetch<TResult>('/store/evaluate/sum/getByStoreId', {
        method: 'POST',
        body: JSON.stringify({
            ...param
        })
    });
}
