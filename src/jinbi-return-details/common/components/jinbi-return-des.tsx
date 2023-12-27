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

const SUB_TYPE = {
  0: '任买返'
};

@withRouter
@Relax
export default class JinbiReturnDes extends React.Component<any, any> {
  props: {
    relaxProps?: {
      activityName: any;
      startTime: any;
      endTime: any;
      isOverlap: any;
      coinNum: any;
      coinActivityFullType: any;
    };
  };

  static relaxProps = {
    activityName: 'activityName',
    startTime: 'startTime',
    endTime: 'endTime',
    isOverlap: 'isOverlap',
    coinNum: 'coinNum',
    coinActivityFullType: 'coinActivityFullType'
  };

  render() {
    const {
      activityName,
      startTime,
      endTime,
      isOverlap,
      coinNum,
      coinActivityFullType
    } = this.props.relaxProps;
    return (
      <GreyBg>
        <Row>
          <Col span={24}>
            <span>活动名称：</span>
            {activityName}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <span>起止时间：</span>
            {moment(startTime)
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
            <span>满赠类型：</span>
            {SUB_TYPE[coinActivityFullType]}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <span>是否叠加优惠：</span>
            {isOverlap == 0 ? '不叠加' : '叠加'}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <span>返还力度：</span>
            {coinNum}鲸币
          </Col>
        </Row>
      </GreyBg>
    );
  }
}
