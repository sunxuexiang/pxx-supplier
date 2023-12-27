/**
 * Created by chenpeng on 2017/10/20.
 */
import { IMap, QL } from 'plume2';

/**
 * 商品消费排行TOP10
 * @type {plume2.QueryLang}
 */
export const skuRankingQL = QL('skuRankingQL', [
  'skuRanking',
  (ranking: IMap) => {
    let skusTop = [];

    if (ranking.size === 0) {
      return skusTop;
    }

    let goodsReportList = ranking.get('goodsReportList');
    let goodsSkuViewList = ranking.get('goodsSkuViewList');
    goodsReportList&&goodsReportList.forEach((report, index) => {
      let sku = goodsSkuViewList.filter(
        (sku) => sku.get('id') == report.get('id')
      );
      if (sku.size > 0) {
        const skuObject = sku.get(0).toJS();
        skusTop.push({
          serialNumber: index + 1,
          skuName: skuObject.goodsInfoName,
          skuNo: skuObject.goodsInfoNo,
          skuOrderCount: report.get('orderCount'),
          skuOrderAmt: report.get('orderAmt'),
          skuOrderNum: report.get('orderNum'),
          skuDetailName: skuObject.detailName
        });
      }
    });

    return skusTop;
  }
]);
