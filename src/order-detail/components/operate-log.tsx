import React from 'react';
import { Relax } from 'plume2';
import { withRouter } from 'react-router-dom';
import { Table, Row, Col, Button, Collapse } from 'antd';
import moment from 'moment';
import { Const, noop } from 'qmkit';

enum operatorDic {
  BOSS = '平台',
  PLATFORM = '平台',
  CUSTOMER = '客户',
  THIRD = '第三方',
  SUPPLIER = '商家',
  PROVIDER = '供应商'
}

const columns = [
  {
    title: '操作方',
    dataIndex: 'operator.platform',
    key: 'operator.platform',
    render: (val) => `${operatorDic[val]}`
  },
  {
    title: '操作人',
    dataIndex: 'operator.name',
    key: 'operator.name'
    // render: (val) => val.substr(0,3) + "****" + val.substr(7)
  },
  {
    title: '时间',
    dataIndex: 'eventTime',
    key: 'eventTime',
    render: (time) =>
      time &&
      moment(time)
        .format(Const.TIME_FORMAT)
        .toString()
  },
  {
    title: '操作类别',
    dataIndex: 'eventType',
    key: 'eventType'
  },
  {
    title: '操作日志',
    dataIndex: 'eventDetail',
    key: 'eventDetail',
    width: '50%'
    // render: (val) => val.substring(0,val.length-8) + '****'
  }
];

const customPanelStyle = {
  paddingRight: 10
};
/**
 * 操作日志
 */
@withRouter
@Relax
export default class OperateLog extends React.Component<any, any> {
  static relaxProps = {
    log: ['detail', 'tradeEventLogs'],
    tradeState: ['detail', 'tradeState'],
    saveVipPrice: noop
  };
  render() {
    const { log, tradeState, saveVipPrice } = this.props.relaxProps;
    const Panel = Collapse.Panel;
    const editFlag =
      tradeState.toJS().payState !== 'PAID' &&
      ['INIT', 'AUDIT', 'DELIVERED_PART'].includes(tradeState.toJS().flowState);
    return (
      <div>
        <div style={styles.backItem}>
          <Collapse>
            <Panel header="操作日志" key="1" style={customPanelStyle}>
              <Row>
                <Col span={24}>
                  <Table
                    rowKey={(_record, index) => index.toString()}
                    columns={columns}
                    dataSource={log.toJS()}
                    pagination={false}
                    bordered
                  />
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>
        <div className="bar-button">
          <Button type="primary" onClick={() => (history as any).go(-1)}>
            返回
          </Button>
          {editFlag && (
            <Button
              type="primary"
              style={{ marginLeft: '16px' }}
              onClick={() => saveVipPrice()}
            >
              保存
            </Button>
          )}
        </div>
      </div>
    );
  }
}

const styles = {
  backItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20
  }
} as any;
