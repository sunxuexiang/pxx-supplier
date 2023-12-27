import React from 'react';
import { Relax } from 'plume2';
import { Switch, Row, Col } from 'antd';
import { noop } from 'qmkit';

@Relax
export default class OpenStatus extends React.Component<any, any> {
  props: {
    relaxProps?: {
      openStatus: string;

      changeOpenStatus: Function;
    };
  };

  static relaxProps = {
    openStatus: 'openStatus',

    changeOpenStatus: noop
  };

  render() {
    const { openStatus, changeOpenStatus } = this.props.relaxProps;

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
            <span style={styles.status}>{openStatus && '已开启'}</span>
          </div>
          <div style={styles.openStatusContent}>
            开启小程序直播后，将会在小程序的发现频道内增加直播频道，此时商家可以申请开通直播功能、创建直播间以及提审直播商品；
            <br />
            关闭后，发现频道将不展示直播相关内容，商家也无法操作直播相关功能；
            <br />
            直播中、未开始、已结束、暂停中、异常状态下的小程序会在前台直播频道展示，打开推荐，该直播会在直播频道的轮播广告位展示，为保证曝光率，请设置少于10个的推荐直播；
          </div>
        </Col>
        <Col style={styles.right} span={6}>
          <Switch
            checked={openStatus && true}
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={(e) => changeOpenStatus(e.valueOf())}
          />
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

  openStatusContent: {
    color: 'rgba(170, 170, 170, 1)',
    fontSize: '12px'
  },

  right: {
    textAlign: 'right'
  }
} as any;
