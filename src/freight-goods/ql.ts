import { QL } from 'plume2';
import { IList } from 'typings/globalType';
import { fromJS } from 'immutable';

/**
 * 展示非删除的快递配送信息
 */
export const goodsExpressSaveRequestsQL = QL('goodsExpressSaveRequestsQL', [
  'freightTemplateGoodsExpressSaveRequests',
  (requests: IList) => {
    return requests.filter((r) => r.get('delFlag') == 0).toJS();
  }
]);

/**
 * 展示非删除的包邮条件
 */
export const goodsFreeSaveRequestsQL = QL('goodsFreeSaveRequestsQL', [
  'freightTemplateGoodsFreeSaveRequests',
  (requests: IList) => {
    return requests.filter((r) => r.get('delFlag') == 0).toJS();
  }
]);

/**
 * 快递配送表单id
 */
export const goodsExpressFormQL = QL('goodsExpressFormQL', [
  'freightTemplateGoodsExpressSaveRequests',
  'freightFreeFlag',
  (requests: IList, freightFreeFlag: number) => {
    return requests
      .map((freight) => {
        return fromJS([
          `destinationArea${freight.get('id')}${freightFreeFlag}`,
          `freightStartPrice${freight.get('id')}${freightFreeFlag}`,
          `freightStartNum${freight.get('id')}${freightFreeFlag}`,
          `freightPlusNum${freight.get('id')}${freightFreeFlag}`,
          `freightPlusPrice${freight.get('id')}${freightFreeFlag}`
        ]);
      })
      .flatMap((id) => id)
      .toJS();
  }
]);

/**
 * 包邮条件表单id
 */
export const goodsFreeFormQL = QL('goodsFreeFormQL', [
  'freightTemplateGoodsFreeSaveRequests',
  (requests: IList) => {
    return requests
      .map((freight) => {
        return fromJS([
          `conditionOne${freight.get('id')}`,
          `conditionTwo${freight.get('id')}`
        ]);
      })
      .flatMap((id) => id)
      .toJS();
  }
]);
