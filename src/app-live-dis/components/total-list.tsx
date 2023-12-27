import React from 'react';
import { Relax } from 'plume2';
import { Row, Col } from 'antd';

const styles = {
  item: {
    textAlign: 'center',
    background: '#eee',
    padding: '10px',
    borderRadius: '6px'
  },
  num: {
    fontWeight: 'bold',
    fontSize: '26px'
  }
} as any;

@Relax
export default class TotalList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: any;
    };
  };

  static relaxProps = {
    detail: 'detail'
  };
  render() {
    const { detail } = this.props.relaxProps;
    return (
      <Row gutter={16}>
        <Col span={4}>
          <div style={styles.item}>
            <div style={styles.num}>{detail.viewerNumber}</div>
            <div>观看总人数</div>
          </div>
        </Col>
        <Col span={4}>
          <div style={styles.item}>
            <div style={styles.num}>{detail.viewerNumber}</div>
            <div>互动人数</div>
          </div>
        </Col>
        <Col span={4}>
          <div style={styles.item}>
            <div style={styles.num}>{detail.addPurchseNumber}</div>
            <div>加购人数</div>
          </div>
        </Col>
        <Col span={4}>
          <div style={styles.item}>
            <div style={styles.num}>{detail.oncePurchseNumber}</div>
            <div>立购人数</div>
          </div>
        </Col>
        <Col span={4}>
          <div style={styles.item}>
            <div style={styles.num}>{detail.couponGetNumber}</div>
            <div>优惠券领取人数</div>
          </div>
        </Col>
        <Col span={4}>
          <div style={styles.item}>
            <div style={styles.num}>{detail.couponGetNumber}</div>
            <div>优惠券领取张数</div>
          </div>
        </Col>
      </Row>
    );
  }

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        <a
          href="javascript:void(0);"
          onClick={() => {
            console.log('移除');
          }}
        >
          查看领券记录
        </a>
      </div>
    );
  };
}
