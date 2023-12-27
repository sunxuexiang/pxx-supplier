import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取后台配送说明文案
 * @param menuId 1: 托运部，2: 快递到家(自费)，6: 上门自提，7: 配送到店（自费），8: 指定物流，9: 同城配送（自费）
 * @param storeId 可以不传，默认为-2，表示获获取后台文案说明
 * @returns Promise<TResult>
 */
export const getLogisticsDistributionText = (
  menuId: string | number,
  storeId?: string | number
) => {
  storeId = storeId ? storeId : '-2';
  return Fetch<TResult>(`/homedelivery/findFirst/${storeId}/${menuId}`);
};

/**
 * 获取快递到家（自费）发货点列表
 */
export const fetchShippingAddress = () => {
  return Fetch<TResult>('/store/shippingAddress/get');
};

/**
 * 更新(新增、删除、修改)快递到家（自费）发货点
 */
export const updateShippingAddress = (params) => {
  return Fetch<TResult>('/store/shippingAddress/save', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};