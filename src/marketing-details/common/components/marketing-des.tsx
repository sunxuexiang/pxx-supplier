import * as React from 'react';
import { Row, Col } from 'antd';

import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import moment from 'moment';
import { Const } from 'qmkit';

import styled from 'styled-components';

const GreyBg = styled.div`
  margin-bottom: -15px;
  color: #333333;
  margin-left: -28px;
  span {
    width: 150px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

const MAK_TYPE = {
  0: '满减',
  1: '满折',
  2: '满赠'
};

const SUB_TYPE = {
  0: '满金额减',
  1: '满数量减',
  2: '满金额折',
  3: '满数量折',
  4: '满金额赠',
  5: '满数量赠',
  6: '订单满赠',
  7: '订单满减',
  8: '订单满折'
};

@withRouter
@Relax
export default class MarketingDes extends React.Component<any, any> {
  props: {
    relaxProps?: {
      marketingName: any;
      beginTime: any;
      endTime: any;
      marketingType: any;
      subType: any;
      isOverlap: any;
      isAddMarketingName: any;
    };
  };

  static relaxProps = {
    marketingName: 'marketingName',
    beginTime: 'beginTime',
    endTime: 'endTime',
    marketingType: 'marketingType',
    subType: 'subType',
    isOverlap: 'isOverlap',
    isAddMarketingName: 'isAddMarketingName'
  };

  render() {
    const {
      marketingName,
      beginTime,
      endTime,
      marketingType,
      subType,
      isOverlap,
      isAddMarketingName
    } = this.props.relaxProps;
    return (
      <GreyBg>
        <Row>
          <Col span={24}>
            <span>活动促销名称：</span>
            {marketingName}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <span>起止时间：</span>
            {moment(beginTime)
              .format(Const.TIME_FORMAT)
              .toString()}{' '}
            ~{' '}
            {moment(endTime)
              .format(Const.TIME_FORMAT)
              .toString()}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <span>{MAK_TYPE[marketingType]}类型：</span>
            {SUB_TYPE[subType]}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <span>是否可跨单品：</span>
            {isAddMarketingName ? '是' : '否'}
          </Col>
        </Row>
        {marketingType != 1 && subType !== 7 && subType !== 8 && subType !== 6 && (
          <Row>
            <Col span={24}>
              <span>叠加优惠：</span>
              {isOverlap == 0 ? '不叠加' : '叠加'}
            </Col>
          </Row>
        )}
      </GreyBg>
    );
  }
}
