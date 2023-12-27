import { QL } from 'plume2';
import { fromJS } from 'immutable';

/**
 * 收款统计
 * @type {plume2.QueryLang}
 */
export const refundCountQL = QL('refundCountQL', [
  'dataList',
  dataList => {
    dataList = fromJS(dataList);
    if (dataList.count() == 0) {
      return (0.0).toFixed(2);
    }
    return dataList
      .reduce((a, b) => a + b.get('actualReturnPrice'), 0)
      .toFixed(2);
  }
]);
