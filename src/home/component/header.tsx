import React from 'react';
import { IMap, Relax } from 'plume2';
import { Link } from 'react-router-dom';

@Relax
export default class Header extends React.Component<any, any> {
  props: {
    relaxProps?: {
      header: IMap;
      storeEvaluateSum: IMap;
    };
  };

  static relaxProps = {
    header: 'header',
    storeEvaluateSum: 'storeEvaluateSum'
  };

  render() {
    const { header, storeEvaluateSum } = this.props.relaxProps as any;

    return (
      <div className="shopHeader">
        <div className="two-text">
          <div style={{ marginBottom: 5 }}>
            {header.get('preTxt')}
            <span>{header.get('errTxt')}</span>
            {header.get('postTxt')}
            <span>{header.get('midErr')}</span>
            {header.get('lastTxt')}
          </div>
          <div>{header.get('text')}</div>
        </div>
        <Link to={'/goods-evaluate-list'}>
          <div className="store-mess">
            <div className="store-score">店铺评分</div>
            <div className="store-number">
              {storeEvaluateSum.sumCompositeScore
                ? parseFloat(storeEvaluateSum.sumCompositeScore).toFixed(2)
                : '-'}
            </div>
            <div className="store-date">近180日</div>
          </div>
        </Link>
      </div>
    );
  }
}
