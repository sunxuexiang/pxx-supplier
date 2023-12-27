import { QL } from 'plume2';

/**
 * 全选是否钩上
 */
export const allCheckedQL = QL('allCheckedQL', [
  'videoList',
  (videoList) => {
    if (!videoList) {
      return false;
    }
    let allChecked = false;
    const allCount = videoList.count();
    const checkedCount = videoList.count((v) => v.get('checked'));
    if (allCount !== 0 && checkedCount !== 0 && allCount === checkedCount) {
      allChecked = true;
    }
    return allChecked;
  }
]);
