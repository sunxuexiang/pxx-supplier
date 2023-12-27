import React from 'react';
import { IMap, Relax } from 'plume2';

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      storeEvaluateSum: IMap;
    };
  };

  static relaxProps = {
    storeEvaluateSum: 'storeEvaluateSum'
  };

  render() {
    const { storeEvaluateSum } = this.props.relaxProps as any;

    return (
      <div>
        评价概况：综合评分&nbsp;&nbsp;&nbsp;
        {storeEvaluateSum.sumCompositeScore
          ? parseFloat(storeEvaluateSum.sumCompositeScore).toFixed(2)
          : '-'}&nbsp;&nbsp;&nbsp; 商品评分&nbsp;&nbsp;&nbsp;
        {storeEvaluateSum.sumGoodsScore
          ? parseFloat(storeEvaluateSum.sumGoodsScore).toFixed(2)
          : '-'}&nbsp;&nbsp;&nbsp; 服务评分&nbsp;&nbsp;&nbsp;
        {storeEvaluateSum.sumServerScore
          ? parseFloat(storeEvaluateSum.sumServerScore).toFixed(2)
          : '-'}&nbsp;&nbsp;&nbsp; 物流评分&nbsp;&nbsp;&nbsp;
        {storeEvaluateSum.sumLogisticsScoreScore
          ? parseFloat(storeEvaluateSum.sumLogisticsScoreScore).toFixed(2)
          : '-'}
      </div>
    );
  }
}
