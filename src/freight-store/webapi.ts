import { Fetch } from 'qmkit';

/**
 * 查询店铺模板信息
 *
 * @export
 * @param {any} freightId
 * @returns
 */
export function fetchFreightStore(freightId) {
  return Fetch(`/freightTemplate/freightTemplateStore/${freightId}`);
}

/**
 * 编辑店铺模板
 *
 * @export
 * @param {any} request
 * @returns
 */
export function freightStoreSave(request) {
  return Fetch('/freightTemplate/freightTemplateStore', {
    method: 'POST',
    body: JSON.stringify(request)
  });
}

/**
 * 查询已经被选中的区域Ids
 */
export function fetchSelectedAreaIds() {
  return Fetch('/freightTemplate/freightTemplateStore/selected/area');
}
