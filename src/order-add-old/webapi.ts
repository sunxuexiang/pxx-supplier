import { Fetch } from 'qmkit';

type TResult = { code: string; message: string; context: any };
type TList = Array<{ accountId: string; accountName: string }>;

/**
 * 查询会员列表
 * @returns {Promise<IAsyncResult<TList>>}
 */
export const fetchAllCustomer = () => {
  return Fetch<TList>('/customer/list');
};

/**
 * 新增会员
 * @param customer
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const addCustomer = (customer) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(customer)
  };
  return Fetch<TResult>(`/customer`, request);
};

/**
 * 查询收货地址
 * @param customerId
 */
export const addressList = (customerId) => {
  return Fetch(`/customer/addressList/${customerId}`);
};

/**
 * 保存收货地址
 * @param address
 */
export const addAddress = (address) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(address)
  };
  return Fetch<TResult>(`/customer/address`, request);
};

/**
 * 修改收货地址
 * @param address
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const updateAddress = (address) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(address)
  };
  return Fetch<TResult>('/customer/address', request);
};

/**
 * 删除地址
 * @param addressId
 */
export const deleteAddress = (addressId) => {
  return Fetch<TResult>(`/customer/address/${addressId}`, {
    method: 'DELETE'
  });
};

/**
 * 查询商品列表
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchGoodsList = (params) => {
  return Fetch('/goods/skus', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 批量查询商品生效的营销活动
 * @param params
 * @returns {Promise<IAsyncResult<any>>}
 */
export const fetchGoodsMarketings = (params) => {
  return Fetch('/goods/marketings', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 获取满赠活动赠品详细信息
 * @param params
 * @returns {Promise<IAsyncResult<any>>}
 */
export const fetchGiftList = (params) => {
  return Fetch('/marketing/fullGift/giftList', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 查询商家店铺品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchBrandList = () => {
  return Fetch<TResult>('/contract/goods/brand/list', {
    method: 'GET'
  });
};

/**
 * 查询商家店铺全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchCateList = () => {
  return Fetch<TResult>('/contract/goods/cate/list', {
    method: 'GET'
  });
};

/**
 *创建订单
 */
export const createOrder = (params) => {
  return Fetch<TResult>('/trade/create', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 保存订单
 */
export const remedyOrder = (params) => {
  return Fetch<TResult>('/trade/remedy', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 查询开票项目列表
 * @returns {Promise<IAsyncResult<Array<TInvoiceProject>>>}
 */
export const fetchInvoiceTitle = () => {
  return Fetch<TResult>('/account/invoiceProjects');
};

/**
 * 获取赠品资质
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const fentchInvoice = (customerId) => {
  return Fetch<TResult>(`/customer/invoiceInfos/${customerId}`);
};

/**
 * 查看订单明细
 * @param tid
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchOrderDetail(tid: string) {
  return Fetch(`/trade/${tid}`);
}

/**
 * 查询订单商品信息
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchOrderGoodsList = (params) => {
  return Fetch('/order/skus', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 查询单个会员信息
 * @param customerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchSingleCustomer = (customerId) => {
  return Fetch(`/customer/${customerId}`);
};

/**
 * 查看正在运行的营销活动
 * @param params.marketingIds 营销id列表
 * @returns 满足条件的营销活动
 */
export const fetchStartingMarketing = (params) => {
  return Fetch<TResult>('/marketing/isStart', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

export const fetchFreight = (params) => {
  return Fetch<TResult>('/trade/getFreight', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 查看是否支持开票
 */
export const fetchInvoiceSwitch = () => {
  return Fetch<TResult>('/account/invoice/switch');
};
