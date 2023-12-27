import * as React from 'react';
import { Row, Col } from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';
import { util } from 'qmkit';

import styled from 'styled-components';

const GreyBg = styled.div`
  padding: 15px 0 15px;
  color: #333333;
  margin-left: -28px;
  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

@withRouter
@Relax
export default class MarketingRule extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      fullReductionLevelList: IList;
      fullDiscountLevelList: IList;
      subType: any;
      marketingType: any;
    };
  };

  static relaxProps = {
    fullReductionLevelList: 'fullReductionLevelList',
    fullDiscountLevelList: 'fullDiscountLevelList',
    subType: 'subType',
    marketingType: 'marketingType'
  };

  render() {
    const {
      fullReductionLevelList,
      fullDiscountLevelList,
      subType,
      marketingType
    } = this.props.relaxProps;
    const list =
      marketingType == 1 ? fullDiscountLevelList : fullReductionLevelList;
    return (
      <div>
        {list.toJS().map((level) => (
          <div key={Math.random()}>
            <GreyBg>
              <Row>
                <Col span={24}>
                  <span>规则：</span>满
                  {level.fullAmount ? level.fullAmount : level.fullCount}
                  {subType == '0' || subType == '2' ? '元' : '件'}
                  {subType == '0' || subType == '1' || subType == '7'
                    ? '减'
                    : '打'}
                  {marketingType == 1
                    ? util.mul(level.discount, 10)
                    : level.reduction}
                  {subType == '0' || subType == '1' || subType == '7'
                    ? '元'
                    : '折'}
                </Col>
              </Row>
            </GreyBg>
          </div>
        ))}
      </div>
    );
  }
}
