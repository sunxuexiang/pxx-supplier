import React from 'react';
import { Relax } from 'plume2';
import { Modal, Table, Button, Row, Col } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class OpenStatus extends React.Component<any, any> {
  props: {
    relaxProps?: {
      openStatus: string;
      cause: string;
      addliveCompany: Function;
    };
  };

  static relaxProps = {
    openStatus: 'openStatus',
    cause: 'cause',
    addliveCompany: noop
  };

  render() {
    const { openStatus, cause, addliveCompany } = this.props.relaxProps;

    return (
      <Row
        type="flex"
        style={styles.openStatus}
        justify="space-between"
        align="middle"
      >
        <Col style={styles.left} span={18}>
          <div style={styles.openStatusTitle}>
            小程序直播
            <span style={styles.status}>
              {openStatus}
              {openStatus == '审核未通过' || openStatus == '禁用中' ? (
                <span style={styles.cause}>{'原因是：' + cause}</span>
              ) : (
                <div />
              )}
            </span>
          </div>
          <div style={styles.openStatusContent}>
            您可以提审直播商品、创建直播间；
            <br />
            主播使用“小程序直播”小程序即可进行直播，用户可以在直播频道和商品详情页看到您的直播；
          </div>
        </Col>
        <Col style={styles.right} span={6}>
          {openStatus == '已开通' || openStatus == '待审核' ? (
            <div />
          ) : (
            <Button type="primary" onClick={() => addliveCompany()}>
              申请开通
            </Button>
          )}
        </Col>
      </Row>
    );
  }
}

const styles = {
  openStatus: {
    width: '100%',
    minHeight: '80px',
    background: 'rgba(245, 245, 245, 1)',
    border: '1px solid rgba(255, 255, 255, 0)',
    padding: '15px 20px 10px 29px',
    marginBottom: '16px'
  },

  openStatusTitle: {
    color: 'rgba(16, 16, 16, 1)',
    fontSize: '14px'
  },

  status: {
    color: 'rgba(255, 102, 0, 1)',
    fontSize: '12px',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5px'
  },

  cause: {
    color: 'rgba(16, 16, 16, 1)',
    fontSize: '12px',
    marginLeft: '10px'
  },

  openStatusContent: {
    color: 'rgba(170, 170, 170, 1)',
    fontSize: '12px'
  },

  right: {
    textAlign: 'right'
  }
} as any;
