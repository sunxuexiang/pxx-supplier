import { QL } from 'plume2';

/**
 * 全选是否钩上
 */
export const allCheckedQL = QL('allCheckedQL', [
  'dataList',
  'selected',
  (dataList, selected) => {
    let allChecked = true;

    if (dataList.count() === 0) {
      return false;
    }

    dataList.forEach((data) => {
      const _index = selected.findIndex((rid) => data.get('id') === rid);
      if (_index == -1) {
        allChecked = false;
        return false; // break
      }
    });

    return allChecked;
  }
]);
