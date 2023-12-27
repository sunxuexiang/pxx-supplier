import React from 'react';
import { Relax } from 'plume2';
import { Row, Col } from 'antd';
import moment from 'moment';
import { Const } from 'qmkit';

@Relax
export default class BaseInfo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      baseInfo: any;
    };
  };

  static relaxProps = {
    baseInfo: 'baseInfo'
  };

  render() {
    const { baseInfo } = this.props.relaxProps;

    return (
      <div style={styles.box}>
        <Row style={styles.row}>
          <Col span={8}>商品名称：{baseInfo.get('goodsName')}</Col>
          <Col span={8}>店铺名称：{baseInfo.get('storeName')}</Col>
          <Col span={8}>拼团人数：{baseInfo.get('grouponNum')}人团</Col>
        </Row>

        <Row style={styles.row}>
          <Col span={8}>
            活动时间：{moment(baseInfo.get('startTime'))
              .format(Const.TIME_FORMAT)
              .toString()}至{moment(baseInfo.get('endTime'))
              .format(Const.TIME_FORMAT)
              .toString()}
          </Col>
          <Col span={8}>
            自动成团：{baseInfo.get('autoGroupon') ? '是' : '否'}
          </Col>
          <Col span={8}>包邮：{baseInfo.get('freeDelivery') ? '是' : '否'}</Col>
        </Row>

        <Row style={styles.row}>
          <Col span={8}>已成团：{baseInfo.get('alreadyGrouponNum')}</Col>
          <Col span={8}>待成团：{baseInfo.get('waitGrouponNum')}</Col>
          <Col span={8}>拼团失败：{baseInfo.get('failGrouponNum')}</Col>
        </Row>
      </div>
    );
  }
}

const styles = {
  box: {
    background: '#fafafa',
    padding: 10,
    marginBottom: 15,
    marginTop: 10
  },
  row: {
    margin: 10
  }
} as any;
