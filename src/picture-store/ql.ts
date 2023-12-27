import { QL } from 'plume2';

/**
 * 全选是否钩上
 */
export const allCheckedQL = QL('allCheckedQL', [
  'imageList',
  imageList => {
    if (!imageList) {
      return false;
    }
    let allChecked = false;
    const allCount = imageList.count();
    const checkedCount = imageList.count(v => v.get('checked'));
    if (allCount !== 0 && checkedCount !== 0 && allCount === checkedCount) {
      allChecked = true;
    }
    return allChecked;
  }
]);
