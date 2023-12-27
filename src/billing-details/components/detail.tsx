import React from 'react';

import { Row, Col } from 'antd';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import moment from 'moment';

import { Const, util } from 'qmkit';

@Relax
export default class BillingDetails extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settlement: IMap;
    };
  };

  static relaxProps = {
    settlement: 'settlement'
  };

  render() {
    const { settlement } = this.props.relaxProps;
    return (
      <div>
        <div style={styles.static}>
          <p style={{ marginLeft: 5, marginBottom: 10 }}>
            <span style={styles.space}>
              店铺名称：{settlement.get('storeName')}
            </span>
            <span style={styles.space}>
              商家编码：{settlement.get('companyCode')}
            </span>
            <span style={styles.space}>
              结算时间段：{settlement.get('startTime')}～{settlement.get(
                'endTime'
              )}
            </span>
            <span style={styles.space}>
              结算单号：{settlement.get('settlementCode')}
            </span>
            <span style={styles.space}>
              结算单生成时间：{moment(settlement.get('createTime'))
                .format(Const.DAY_FORMAT)
                .toString()}
            </span>
          </p>

          <Row>
            <Col span={3}>
              <p style={styles.nav}>商品实付总额</p>
              <p style={styles.num}>
                {settlement.get('splitPayPrice')
                  ? util.FORMAT_YUAN(settlement.get('splitPayPrice'))
                  : '¥0.00'}
              </p>
            </Col>
            <Col span={3}>
              <p style={styles.nav}>通用券优惠总额</p>
              <p style={styles.num}>
                {settlement.get('commonCouponPrice')
                  ? util.FORMAT_YUAN(settlement.get('commonCouponPrice'))
                  : '¥0.00'}
              </p>
            </Col>
            <Col span={3}>
              <p style={styles.nav}>积分抵扣总额</p>
              <p style={styles.num}>
                {settlement.get('pointPrice')
                  ? util.FORMAT_YUAN(settlement.get('pointPrice'))
                  : '¥0.00'}
              </p>
            </Col>
            <Col span={3}>
              <p style={styles.nav}>供货总额</p>
              <p style={styles.num}>
                {settlement.get('providerPrice')
                  ? util.FORMAT_YUAN(settlement.get('providerPrice'))
                  : '¥0.00'}
              </p>
            </Col>
            <Col span={3}>
              <p style={styles.nav}>平台佣金总额</p>
              <p style={styles.num}>
                {settlement.get('platformPrice')
                  ? util.FORMAT_YUAN(settlement.get('platformPrice'))
                  : '¥0.00'}
              </p>
            </Col>
            <Col span={3}>
              <p style={styles.nav}>分销佣金总额</p>
              <p style={styles.num}>
                {settlement.get('commissionPrice')
                  ? util.FORMAT_YUAN(settlement.get('commissionPrice'))
                  : '¥0.00'}
              </p>
            </Col>
            <Col span={3}>
              <p style={styles.nav}>运费总额</p>
              <p style={styles.num}>
                {settlement.get('deliveryPrice')
                  ? util.FORMAT_YUAN(settlement.get('deliveryPrice'))
                  : '¥0.00'}
              </p>
            </Col>
            <Col span={3}>
              <p style={styles.nav}>店铺应收总额</p>
              <p style={styles.num}>
                {settlement.get('storePrice')
                  ? util.FORMAT_YUAN(settlement.get('storePrice'))
                  : '¥0.00'}
              </p>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const styles = {
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5
  },
  num: {
    color: '#F56C1D',
    fontSize: 16,
    padding: 5
  },
  static: {
    background: '#fafafa',
    padding: 10,
    marginBottom: 15,
    marginTop: 10
  },
  space: {
    marginRight: 35
  }
};
