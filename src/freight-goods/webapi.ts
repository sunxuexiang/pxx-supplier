import { Fetch } from 'qmkit';

/**
 * 查询单品运费模板
 * @param freightId
 */
export function fetchFreightGoods(freightId, pageType = 0) {
  return Fetch(
    `/${
      pageType == 1 ? 'freightTemplateIntraCityLogistics' : 'freightTemplate'
    }/freightTemplateGoods/${freightId}`
  );
}

/**
 * 保存单品运费模板
 * @param request
 */
export function saveFreightGoods(request, pageType = 0) {
  return Fetch(
    `/${
      pageType == 1 ? 'freightTemplateIntraCityLogistics' : 'freightTemplate'
    }/freightTemplateGoods`,
    {
      method: 'POST',
      body: JSON.stringify(request)
    }
  );
}
