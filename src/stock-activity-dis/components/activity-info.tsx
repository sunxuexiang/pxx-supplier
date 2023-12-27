import React from 'react';

import { Relax } from 'plume2';
import { Row, Col, Spin } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import { IMap } from 'typings/globalType';
import { Const } from 'qmkit';
import CouponList from './coupon-list';
import GoodsList from './goods-list';

const GreyBg = styled.div`
  color: #333333;
  margin-left: -28px;
  span {
    width: 130px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

@Relax
export default class ActivityInfo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      activityInfo: IMap;
      loading: boolean;
    };
    type?: any;
  };

  static relaxProps = {
    activityInfo: 'activityInfo',
    loading: 'loading'
  };

  render() {
    const { activityInfo, loading } = this.props.relaxProps;
    const { type } = this.props;
    const couponActivity = activityInfo;
    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={24}>
              <span>活动名称：</span>
              {couponActivity.get('activityName')}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {couponActivity.get('couponActivityType') == 1 ? (
                <span>发放时间：</span>
              ) : (
                <span>活动时间：</span>
              )}
              {couponActivity.get('couponActivityType') == 1
                ? moment(couponActivity.get('startTime'))
                  .format(Const.TIME_FORMAT)
                  .toString()
                : moment(couponActivity.get('startTime'))
                  .format(Const.TIME_FORMAT)
                  .toString() +
                ' ~ ' +
                moment(couponActivity.get('endTime'))
                  .format(Const.TIME_FORMAT)
                  .toString()}
            </Col>
          </Row>
          {/* {
            couponActivityLevelVOSasd.length == 0 &&
            <Row>
              <Col span={24}>
                <span>优惠券：</span>
              </Col>
            </Row>
          } */}
        </GreyBg>
        {/* {type == 9 &&
          <CouponList />} */}
        {/* <GoodsList type={type} /> */}
        {/* <GreyBg>
          {couponActivity.get('couponActivityType') != 1 && (
            <Row>
              <Col span={24}>
                <span>
                  {couponActivity.get('couponActivityType') == 2
                    ? '优惠券总组数：'
                    : '每人限领次数：'}
                </span>
                {couponActivity.get('receiveType') == '0'
                  ? '不限'
                  : couponActivity.get('receiveCount') + '组'}
              </Col>
            </Row>
          )}
        </GreyBg> */}

      </div>
    );
  }


}
